package ai.amreye.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.LayerDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

public final class MainActivity extends Activity {
    public static final String LOCAL_URL = "https://appassets.androidplatform.net/index.html#hub";
    public static final String ONLINE_URL = "https://amreye.in/#home";
    private static final long MIN_SPLASH_DURATION_MS = 1500;
    private static final int SAVE_SYNTHETIC_REPORT = 4301;
    private byte[] pendingSyntheticReport;

    private WebView webView;
    private FrameLayout splashLayout;
    private FrameLayout transitionLayout;
    private TextView transitionStatusText;
    private ProgressBar topProgressBar;
    private LinearLayout errorLayout;
    private TextView statusText;
    private TextView errorMsgText;
    private long splashStartTime;
    private boolean isSplashDismissed = false;
    private boolean hasLoadedSuccessfully = false;
    private boolean isOnlineModeActive = true;
    private final Handler handler = new Handler(Looper.getMainLooper());

    private final String[] telemetrySteps = {
            "INITIALIZING OPTICAL NEURAL CORE...",
            "CALIBRATING ZONE METROLOGY MATRIX...",
            "CONNECTING TO AMREYE.IN..."
    };
    private int telemetryIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        splashStartTime = System.currentTimeMillis();

        // 1. Status bar & navigation bar theme: deep obsidian with crisp white system icons
        android.view.Window window = getWindow();
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#07090b"));
        window.setNavigationBarColor(Color.parseColor("#07090b"));
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            int flags = window.getDecorView().getSystemUiVisibility();
            flags &= ~android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            window.getDecorView().setSystemUiVisibility(flags);
        }

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#07090b"));
        rootLayout.setFitsSystemWindows(true);

        // 2. Core High-Speed WebView configured for live website & offline fallback
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#07090b"));
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);
        settings.setSupportMultipleWindows(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Mobile responsive user-agent with AMReye app identifier
        String defaultUa = WebSettings.getDefaultUserAgent(this);
        settings.setUserAgentString(defaultUa + " AMReyeMobileApp/1.5.6");
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            settings.setOffscreenPreRaster(true);
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }

        // Enable cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }

        // Bridge & Clients
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setWebViewClient(new FrontierWebClient());
        webView.setWebChromeClient(new FrontierChromeClient());

        // File download handling -> reroute to Chrome or system browser
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                openInExternalBrowser(url);
            }
        });

        rootLayout.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 3. Top Cyber Laser Progress Bar for page and section transitions
        topProgressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        topProgressBar.setMax(100);
        topProgressBar.setProgress(0);
        topProgressBar.setVisibility(View.GONE);

        GradientDrawable progressBg = new GradientDrawable();
        progressBg.setColor(Color.TRANSPARENT);

        GradientDrawable progressFg = new GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                new int[]{Color.parseColor("#38bdf8"), Color.parseColor("#78ddcc"), Color.parseColor("#34d399")}
        );
        progressFg.setCornerRadius(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 2, getResources().getDisplayMetrics()));
        ClipDrawable clipFg = new ClipDrawable(progressFg, Gravity.START, ClipDrawable.HORIZONTAL);

        LayerDrawable layers = new LayerDrawable(new android.graphics.drawable.Drawable[]{progressBg, clipFg});
        layers.setId(0, android.R.id.background);
        layers.setId(1, android.R.id.progress);
        topProgressBar.setProgressDrawable(layers);

        FrameLayout.LayoutParams topBarParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 3.5f, getResources().getDisplayMetrics())
        );
        topBarParams.gravity = Gravity.TOP;
        rootLayout.addView(topProgressBar, topBarParams);

        // 4. Frontier AI Starting Animation (Splash Screen)
        splashLayout = buildFrontierSplashView();
        rootLayout.addView(splashLayout, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 5. Fullscreen Page Transition Overlay (Iris Scanner for section changes)
        transitionLayout = buildTransitionView();
        rootLayout.addView(transitionLayout, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // Ensure proper z-ordering: progress bar, splash, and transition draw above WebView
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            topProgressBar.setElevation(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 8, getResources().getDisplayMetrics()));
            splashLayout.setElevation(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, getResources().getDisplayMetrics()));
            transitionLayout.setElevation(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 15, getResources().getDisplayMetrics()));
        }
        topProgressBar.bringToFront();
        splashLayout.bringToFront();

        setContentView(rootLayout);

        // Start cycling telemetry text during startup
        startTelemetryLoop();

        // Restore state or load live website directly
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            startApplication();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != SAVE_SYNTHETIC_REPORT) return;
        final byte[] report = pendingSyntheticReport;
        pendingSyntheticReport = null;
        if (resultCode != RESULT_OK || data == null || data.getData() == null) return;
        if (report == null) {
            Toast.makeText(this, "Report was not retained. Export it again from the demonstration.", Toast.LENGTH_LONG).show();
            return;
        }
        final Uri destination = data.getData();
        if (!"content".equals(destination.getScheme())) {
            Toast.makeText(this, "Choose a document destination in the system save picker", Toast.LENGTH_LONG).show();
            return;
        }
        new Thread(() -> {
            try {
                try (OutputStream output = getContentResolver().openOutputStream(destination, "w")) {
                    if (output == null) throw new java.io.IOException("Document destination unavailable");
                    output.write(report);
                    output.flush();
                }
                runOnUiThread(() -> Toast.makeText(this, "Synthetic report saved", Toast.LENGTH_SHORT).show());
            } catch (Exception error) {
                runOnUiThread(() -> Toast.makeText(this, "Could not save the synthetic report", Toast.LENGTH_LONG).show());
            }
        }, "synthetic-report-save").start();
    }

    private void requestSyntheticReportSave(String format, byte[] report) {
        if (report == null || !AppUrlPolicy.isTrustedPage(webView.getUrl())) {
            Toast.makeText(this, "Only JSON or CSV reports up to 1 MiB can be saved", Toast.LENGTH_LONG).show();
            return;
        }
        if (pendingSyntheticReport != null) {
            Toast.makeText(this, "Finish or cancel the current save first", Toast.LENGTH_SHORT).show();
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(SyntheticReportPolicy.mimeType(format));
        intent.putExtra(Intent.EXTRA_TITLE, SyntheticReportPolicy.fileName(format));
        pendingSyntheticReport = report;
        try {
            startActivityForResult(intent, SAVE_SYNTHETIC_REPORT);
        } catch (Exception error) {
            pendingSyntheticReport = null;
            Toast.makeText(this, "No system document save picker is available", Toast.LENGTH_LONG).show();
        }
    }

    private void startTelemetryLoop() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isSplashDismissed || statusText == null) return;
                telemetryIndex = (telemetryIndex + 1) % telemetrySteps.length;
                statusText.animate()
                        .alpha(0.3f)
                        .setDuration(200)
                        .withEndAction(() -> {
                            if (statusText != null && !isSplashDismissed) {
                                statusText.setText(telemetrySteps[telemetryIndex]);
                                statusText.animate().alpha(1.0f).setDuration(250).start();
                            }
                        })
                        .start();
                handler.postDelayed(this, 900);
            }
        }, 800);
    }

    private void startApplication() {
        if (isNetworkConnected()) {
            loadLiveWebsite();
        } else {
            loadOfflineApplication();
        }
    }

    private void loadLiveWebsite() {
        if (errorLayout != null) errorLayout.setVisibility(View.GONE);
        isOnlineModeActive = true;
        hasLoadedSuccessfully = false;
        webView.loadUrl(ONLINE_URL);
    }

    private void loadOfflineApplication() {
        if (errorLayout != null) errorLayout.setVisibility(View.GONE);
        if (statusText != null) statusText.setText("Loading local application...");
        isOnlineModeActive = false;
        hasLoadedSuccessfully = false;
        webView.loadUrl(LOCAL_URL);
    }

    private boolean isNetworkConnected() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo net = cm != null ? cm.getActiveNetworkInfo() : null;
            return net != null && net.isConnected();
        } catch (Exception e) {
            return false;
        }
    }

    public void openInExternalBrowser(String url) {
        if (AppUrlPolicy.isBundledCompendium(url)) {
            openBundledCompendium();
            return;
        }
        if (!AppUrlPolicy.isWebUrl(url)) return;
        try {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            browserIntent.addCategory(Intent.CATEGORY_BROWSABLE);
            browserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(browserIntent);
        } catch (Exception e) {
            try {
                Intent chooser = Intent.createChooser(new Intent(Intent.ACTION_VIEW, Uri.parse(url)), "Open link with");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(chooser);
            } catch (Exception ex) {
                Toast.makeText(this, "Could not launch web browser", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openBundledCompendium() {
        Uri document = Uri.parse(AppUrlPolicy.COMPENDIUM_CONTENT_URI);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(document, "application/pdf");
        intent.setClipData(ClipData.newRawUri("AMReye.AI project compendium", document));
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "No PDF viewer is installed. Open the research library to read offline.", Toast.LENGTH_LONG).show();
        } catch (Exception error) {
            Toast.makeText(this, "Could not open the packaged compendium", Toast.LENGTH_LONG).show();
        }
    }

    public void handleMailto(String url) {
        if (url == null || !"mailto".equalsIgnoreCase(Uri.parse(url).getScheme())) return;
        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            try {
                Intent chooser = Intent.createChooser(new Intent(Intent.ACTION_SENDTO, Uri.parse(url)), "Compose Email via");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(chooser);
            } catch (Exception ex) {
                Toast.makeText(this, "No email app found (Gmail)", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception ex) {
            Toast.makeText(this, "Error opening email client", Toast.LENGTH_SHORT).show();
        }
    }

    private FrameLayout buildFrontierSplashView() {
        FrameLayout layout = new FrameLayout(this);
        layout.setBackgroundColor(Color.parseColor("#07090b"));

        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);

        // A. Holographic Quantum Iris Scanner
        int irisSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 144, getResources().getDisplayMetrics());
        FrameLayout irisFrame = new FrameLayout(this);
        LinearLayout.LayoutParams irisParams = new LinearLayout.LayoutParams(irisSize, irisSize);
        irisParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 26, getResources().getDisplayMetrics());

        // 1. Outer Pulse Aura Halo
        View outerRing = new View(this);
        GradientDrawable outerRingDrawable = new GradientDrawable();
        outerRingDrawable.setShape(GradientDrawable.OVAL);
        outerRingDrawable.setStroke((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 2.5f, getResources().getDisplayMetrics()), Color.parseColor("#78ddcc"));
        outerRingDrawable.setColor(Color.parseColor("#081d22"));
        outerRing.setBackground(outerRingDrawable);

        AnimationSet outerAnim = new AnimationSet(true);
        outerAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        ScaleAnimation outerScale = new ScaleAnimation(0.92f, 1.14f, 0.92f, 1.14f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        outerScale.setDuration(1700);
        outerScale.setRepeatCount(Animation.INFINITE);
        outerScale.setRepeatMode(Animation.REVERSE);
        AlphaAnimation outerAlpha = new AlphaAnimation(0.35f, 0.95f);
        outerAlpha.setDuration(1700);
        outerAlpha.setRepeatCount(Animation.INFINITE);
        outerAlpha.setRepeatMode(Animation.REVERSE);
        outerAnim.addAnimation(outerScale);
        outerAnim.addAnimation(outerAlpha);
        outerRing.startAnimation(outerAnim);

        irisFrame.addView(outerRing, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // 2. Middle Rotating Radar Reticle Ring
        int reticleSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 114, getResources().getDisplayMetrics());
        View reticleRing = new View(this);
        GradientDrawable reticleDrawable = new GradientDrawable();
        reticleDrawable.setShape(GradientDrawable.OVAL);
        reticleDrawable.setStroke(
                (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1.5f, getResources().getDisplayMetrics()),
                Color.parseColor("#38bdf8"),
                TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 6, getResources().getDisplayMetrics()),
                TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics())
        );
        reticleDrawable.setColor(Color.TRANSPARENT);
        reticleRing.setBackground(reticleDrawable);

        RotateAnimation rotateAnim = new RotateAnimation(0f, 360f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        rotateAnim.setDuration(3400);
        rotateAnim.setInterpolator(new LinearInterpolator());
        rotateAnim.setRepeatCount(Animation.INFINITE);
        reticleRing.startAnimation(rotateAnim);

        FrameLayout.LayoutParams reticleParams = new FrameLayout.LayoutParams(reticleSize, reticleSize);
        reticleParams.gravity = Gravity.CENTER;
        irisFrame.addView(reticleRing, reticleParams);

        // 3. Central AMReye Logo with synchronized breathing animation
        ImageView logoView = new ImageView(this);
        logoView.setImageResource(R.drawable.ic_launcher);
        int logoSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 82, getResources().getDisplayMetrics());
        FrameLayout.LayoutParams logoParams = new FrameLayout.LayoutParams(logoSize, logoSize);
        logoParams.gravity = Gravity.CENTER;
        irisFrame.addView(logoView, logoParams);

        AnimationSet logoAnim = new AnimationSet(true);
        ScaleAnimation logoScale = new ScaleAnimation(0.95f, 1.05f, 0.95f, 1.05f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        logoScale.setDuration(1500);
        logoScale.setRepeatCount(Animation.INFINITE);
        logoScale.setRepeatMode(Animation.REVERSE);
        logoAnim.addAnimation(logoScale);
        logoView.startAnimation(logoAnim);

        container.addView(irisFrame, irisParams);

        // B. Sleek Modern Brand Typography
        TextView titleText = new TextView(this);
        titleText.setText("AMReye.AI");
        titleText.setTextColor(Color.WHITE);
        titleText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30);
        titleText.setTypeface(Typeface.create("sans-serif-medium", Typeface.BOLD));
        titleText.setLetterSpacing(0.04f);
        titleText.setGravity(Gravity.CENTER);
        container.addView(titleText);

        TextView subText = new TextView(this);
        subText.setText("FRONTIER ANTIMICROBIAL INTELLIGENCE");
        subText.setTextColor(Color.parseColor("#78ddcc"));
        subText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        subText.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        subText.setLetterSpacing(0.24f);
        subText.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        subParams.topMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 6, getResources().getDisplayMetrics());
        subParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 28, getResources().getDisplayMetrics());
        container.addView(subText, subParams);

        // C. Cyberpunk Laser Progress Bar
        FrameLayout loaderFrame = new FrameLayout(this);
        int trackWidth = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 190, getResources().getDisplayMetrics());
        int trackHeight = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics());
        LinearLayout.LayoutParams loaderParams = new LinearLayout.LayoutParams(trackWidth, trackHeight);
        loaderParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 14, getResources().getDisplayMetrics());

        GradientDrawable trackBg = new GradientDrawable();
        trackBg.setColor(Color.parseColor("#0e171f"));
        trackBg.setCornerRadius(trackHeight / 2.0f);
        loaderFrame.setBackground(trackBg);

        View laserBar = new View(this);
        GradientDrawable laserDrawable = new GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                new int[]{Color.parseColor("#38bdf8"), Color.parseColor("#78ddcc"), Color.parseColor("#34d399")}
        );
        laserDrawable.setCornerRadius(trackHeight / 2.0f);
        laserBar.setBackground(laserDrawable);

        ScaleAnimation laserAnim = new ScaleAnimation(0.15f, 1.0f, 1.0f, 1.0f, Animation.RELATIVE_TO_SELF, 0.0f, Animation.RELATIVE_TO_SELF, 0.5f);
        laserAnim.setDuration(1100);
        laserAnim.setRepeatCount(Animation.INFINITE);
        laserAnim.setRepeatMode(Animation.REVERSE);
        laserAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        laserBar.startAnimation(laserAnim);

        loaderFrame.addView(laserBar, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        container.addView(loaderFrame, loaderParams);

        // D. Telemetry Status Readout
        statusText = new TextView(this);
        statusText.setText(telemetrySteps[0]);
        statusText.setTextColor(Color.parseColor("#94a3b8"));
        statusText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        statusText.setTypeface(Typeface.MONOSPACE);
        statusText.setLetterSpacing(0.08f);
        statusText.setGravity(Gravity.CENTER);
        container.addView(statusText);

        // E. Retry / Error layout
        errorLayout = new LinearLayout(this);
        errorLayout.setOrientation(LinearLayout.VERTICAL);
        errorLayout.setGravity(Gravity.CENTER);
        errorLayout.setVisibility(View.GONE);
        LinearLayout.LayoutParams errParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        errParams.topMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 16, getResources().getDisplayMetrics());

        errorMsgText = new TextView(this);
        errorMsgText.setText("Unable to reach live website.");
        errorMsgText.setTextColor(Color.parseColor("#f87171"));
        errorMsgText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        errorMsgText.setGravity(Gravity.CENTER);
        errorLayout.addView(errorMsgText);

        Button retryButton = new Button(this);
        retryButton.setText("Continue in Offline Mode");
        retryButton.setTextColor(Color.parseColor("#07090b"));
        retryButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        retryButton.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        GradientDrawable btnBg = new GradientDrawable();
        btnBg.setColor(Color.parseColor("#78ddcc"));
        btnBg.setCornerRadius(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 12, getResources().getDisplayMetrics()));
        retryButton.setBackground(btnBg);
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 210, getResources().getDisplayMetrics()),
                (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 42, getResources().getDisplayMetrics())
        );
        btnParams.topMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 14, getResources().getDisplayMetrics());
        retryButton.setLayoutParams(btnParams);
        retryButton.setOnClickListener(v -> {
            loadOfflineApplication();
        });
        errorLayout.addView(retryButton);

        container.addView(errorLayout, errParams);

        FrameLayout.LayoutParams containerParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        containerParams.gravity = Gravity.CENTER;
        layout.addView(container, containerParams);

        return layout;
    }

    private void dismissFrontierSplash() {
        if (isSplashDismissed || splashLayout == null) return;
        isSplashDismissed = true;

        long elapsed = System.currentTimeMillis() - splashStartTime;
        long delay = Math.max(0, MIN_SPLASH_DURATION_MS - elapsed);

        handler.postDelayed(() -> {
            splashLayout.animate()
                    .alpha(0.0f)
                    .scaleX(1.05f)
                    .scaleY(1.05f)
                    .setDuration(450)
                    .withEndAction(() -> {
                        if (splashLayout != null) {
                            splashLayout.setVisibility(View.GONE);
                        }
                    })
                    .start();
            handler.postDelayed(() -> {
                if (splashLayout != null) {
                    splashLayout.setVisibility(View.GONE);
                }
            }, 500);
        }, delay);
    }

    private FrameLayout buildTransitionView() {
        FrameLayout layout = new FrameLayout(this);
        layout.setBackgroundColor(Color.parseColor("#07090b"));
        layout.setVisibility(View.GONE);
        layout.setAlpha(0.0f);
        layout.setClickable(false);

        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);

        // Holographic Iris Scanner
        int irisSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 130, getResources().getDisplayMetrics());
        FrameLayout irisFrame = new FrameLayout(this);
        LinearLayout.LayoutParams irisParams = new LinearLayout.LayoutParams(irisSize, irisSize);
        irisParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 22, getResources().getDisplayMetrics());

        // Outer Pulse Ring
        View outerRing = new View(this);
        GradientDrawable outerRingDrawable = new GradientDrawable();
        outerRingDrawable.setShape(GradientDrawable.OVAL);
        outerRingDrawable.setStroke((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 2.5f, getResources().getDisplayMetrics()), Color.parseColor("#78ddcc"));
        outerRingDrawable.setColor(Color.parseColor("#081d22"));
        outerRing.setBackground(outerRingDrawable);

        AnimationSet outerAnim = new AnimationSet(true);
        outerAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        ScaleAnimation outerScale = new ScaleAnimation(0.92f, 1.14f, 0.92f, 1.14f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        outerScale.setDuration(1250);
        outerScale.setRepeatCount(Animation.INFINITE);
        outerScale.setRepeatMode(Animation.REVERSE);
        AlphaAnimation outerAlpha = new AlphaAnimation(0.4f, 0.95f);
        outerAlpha.setDuration(1250);
        outerAlpha.setRepeatCount(Animation.INFINITE);
        outerAlpha.setRepeatMode(Animation.REVERSE);
        outerAnim.addAnimation(outerScale);
        outerAnim.addAnimation(outerAlpha);
        outerRing.startAnimation(outerAnim);
        irisFrame.addView(outerRing, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Middle Rotating Radar Reticle Ring
        int reticleSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 102, getResources().getDisplayMetrics());
        View reticleRing = new View(this);
        GradientDrawable reticleDrawable = new GradientDrawable();
        reticleDrawable.setShape(GradientDrawable.OVAL);
        reticleDrawable.setStroke(
                (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1.5f, getResources().getDisplayMetrics()),
                Color.parseColor("#38bdf8"),
                TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 6, getResources().getDisplayMetrics()),
                TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4, getResources().getDisplayMetrics())
        );
        reticleDrawable.setColor(Color.TRANSPARENT);
        reticleRing.setBackground(reticleDrawable);

        RotateAnimation rotateAnim = new RotateAnimation(0f, 360f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        rotateAnim.setDuration(2400);
        rotateAnim.setInterpolator(new LinearInterpolator());
        rotateAnim.setRepeatCount(Animation.INFINITE);
        reticleRing.startAnimation(rotateAnim);

        FrameLayout.LayoutParams reticleParams = new FrameLayout.LayoutParams(reticleSize, reticleSize);
        reticleParams.gravity = Gravity.CENTER;
        irisFrame.addView(reticleRing, reticleParams);

        // Center Logo
        ImageView logoView = new ImageView(this);
        logoView.setImageResource(R.drawable.ic_launcher);
        int logoSize = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 72, getResources().getDisplayMetrics());
        FrameLayout.LayoutParams logoParams = new FrameLayout.LayoutParams(logoSize, logoSize);
        logoParams.gravity = Gravity.CENTER;
        irisFrame.addView(logoView, logoParams);

        container.addView(irisFrame, irisParams);

        // Brand Typography
        TextView titleText = new TextView(this);
        titleText.setText("AMReye.AI");
        titleText.setTextColor(Color.WHITE);
        titleText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 26);
        titleText.setTypeface(Typeface.create("sans-serif-medium", Typeface.BOLD));
        titleText.setLetterSpacing(0.04f);
        titleText.setGravity(Gravity.CENTER);
        container.addView(titleText);

        transitionStatusText = new TextView(this);
        transitionStatusText.setText("EXPLORING PLATFORM");
        transitionStatusText.setTextColor(Color.parseColor("#78ddcc"));
        transitionStatusText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        transitionStatusText.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        transitionStatusText.setLetterSpacing(0.20f);
        transitionStatusText.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        subParams.topMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 6, getResources().getDisplayMetrics());
        subParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 22, getResources().getDisplayMetrics());
        container.addView(transitionStatusText, subParams);

        // Laser Loader
        FrameLayout loaderFrame = new FrameLayout(this);
        int trackWidth = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 170, getResources().getDisplayMetrics());
        int trackHeight = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 3.5f, getResources().getDisplayMetrics());
        LinearLayout.LayoutParams loaderParams = new LinearLayout.LayoutParams(trackWidth, trackHeight);

        GradientDrawable trackBg = new GradientDrawable();
        trackBg.setColor(Color.parseColor("#0e171f"));
        trackBg.setCornerRadius(trackHeight / 2.0f);
        loaderFrame.setBackground(trackBg);

        View laserBar = new View(this);
        GradientDrawable laserDrawable = new GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                new int[]{Color.parseColor("#38bdf8"), Color.parseColor("#78ddcc"), Color.parseColor("#34d399")}
        );
        laserDrawable.setCornerRadius(trackHeight / 2.0f);
        laserBar.setBackground(laserDrawable);

        ScaleAnimation laserAnim = new ScaleAnimation(0.15f, 1.0f, 1.0f, 1.0f, Animation.RELATIVE_TO_SELF, 0.0f, Animation.RELATIVE_TO_SELF, 0.5f);
        laserAnim.setDuration(750);
        laserAnim.setRepeatCount(Animation.INFINITE);
        laserAnim.setRepeatMode(Animation.REVERSE);
        laserAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        laserBar.startAnimation(laserAnim);

        loaderFrame.addView(laserBar, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        container.addView(loaderFrame, loaderParams);

        FrameLayout.LayoutParams containerParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        containerParams.gravity = Gravity.CENTER;
        layout.addView(container, containerParams);

        return layout;
    }

    private final Runnable hideTransitionRunnable = new Runnable() {
        @Override
        public void run() {
            if (transitionLayout == null) return;
            transitionLayout.animate()
                    .alpha(0.0f)
                    .setDuration(220)
                    .withEndAction(() -> {
                        if (transitionLayout != null) {
                            transitionLayout.setVisibility(View.GONE);
                            transitionLayout.setAlpha(0.0f);
                        }
                    })
                    .start();
            handler.postDelayed(() -> {
                if (transitionLayout != null) {
                    transitionLayout.setVisibility(View.GONE);
                    transitionLayout.setAlpha(0.0f);
                }
            }, 260);
        }
    };

    public void showFullscreenTransitionNative(String sectionName) {
        if (transitionLayout == null) return;
        handler.removeCallbacks(hideTransitionRunnable);
        
        transitionLayout.animate().cancel();
        
        if (transitionStatusText != null) {
            String label = (sectionName != null && !sectionName.trim().isEmpty())
                    ? sectionName.replace("#", "").trim().toUpperCase()
                    : "NAVIGATING";
            transitionStatusText.setText("EXPLORING · " + label);
        }
        
        transitionLayout.setAlpha(0.0f);
        transitionLayout.setVisibility(View.VISIBLE);
        transitionLayout.bringToFront();
        transitionLayout.animate()
                .alpha(1.0f)
                .setDuration(120)
                .withEndAction(() -> {
                    handler.postDelayed(hideTransitionRunnable, 350);
                })
                .start();
    }

    private void showConnectionError(String message) {
        runOnUiThread(() -> {
            if (isOnlineModeActive && !hasLoadedSuccessfully) {
                if (errorMsgText != null) errorMsgText.setText(message);
                if (errorLayout != null) errorLayout.setVisibility(View.VISIBLE);
                if (statusText != null) statusText.setText("CONNECTION NOTICE");
            }
        });
    }

    private void injectFrontierEnhancer(WebView view) {
        try {
            InputStream stream = getAssets().open("frontier-enhancer.js");
            int size = stream.available();
            byte[] buffer = new byte[size];
            stream.read(buffer);
            stream.close();
            String script = new String(buffer, "UTF-8");
            view.evaluateJavascript(script, null);
        } catch (Exception ignored) {
            view.evaluateJavascript("(function(){ document.documentElement.style.scrollBehavior='smooth'; })();", null);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            webView.evaluateJavascript("(function() {" +
                    "if (typeof window.__closeFrontierMenu === 'function') {" +
                    "  var isOpen = !!document.querySelector('[data-slot=\"sheet-content\"][data-state=\"open\"], .atelier-menu[data-state=\"open\"], .standalone-drawer-overlay.is-open, .standalone-drawer-card.is-open, body.menu-open');" +
                    "  if (isOpen) { window.__closeFrontierMenu(); return 'closed_modal'; }" +
                    "}" +
                    "var openModal = document.querySelector('dialog[open], .standalone-modal-overlay.is-open, .standalone-drawer-overlay.is-open, [data-state=\"open\"]');" +
                    "if (openModal) {" +
                    "  var closeBtn = openModal.querySelector('[data-report-close], button[class*=\"close\"], button[aria-label*=\"Close\"], .pitch-modal-close, .directory-close-btn, .atelier-menu-close, .atelier-menu-done-btn');" +
                    "  if (closeBtn) { closeBtn.click(); return 'closed_modal'; }" +
                    "  if (openModal.tagName === 'DIALOG' && typeof openModal.close === 'function') { openModal.close(); return 'closed_modal'; }" +
                    "  openModal.classList.remove('is-open');" +
                    "  return 'closed_modal';" +
                    "}" +
                    "return 'none';" +
                    "})()", result -> {
                if (result != null && result.contains("closed_modal")) {
                    return;
                }
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    super.onKeyDown(keyCode, event);
                }
            });
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    public final class AndroidBridge {
        @JavascriptInterface
        public void saveSyntheticReport(String format, String text) {
            byte[] report = SyntheticReportPolicy.encode(format, text);
            runOnUiThread(() -> requestSyntheticReportSave(format, report));
        }

        @JavascriptInterface
        public boolean isNetworkAvailable() {
            return isNetworkConnected();
        }

        @JavascriptInterface
        public void onSectionLoading(boolean isLoading) {
            runOnUiThread(() -> {
                if (topProgressBar != null) {
                    if (isLoading) {
                        topProgressBar.setVisibility(View.VISIBLE);
                        topProgressBar.setProgress(35);
                    } else {
                        topProgressBar.setProgress(100);
                        handler.postDelayed(() -> topProgressBar.setVisibility(View.GONE), 250);
                    }
                }
            });
        }

        @JavascriptInterface
        public void showPageTransition(String sectionName) {
            runOnUiThread(() -> showFullscreenTransitionNative(sectionName));
        }

        @JavascriptInterface
        public void openInBrowser(String url) {
            runOnUiThread(() -> openInExternalBrowser(url));
        }

        @JavascriptInterface
        public void openEmailLink(String url) {
            runOnUiThread(() -> handleMailto(url));
        }

        @JavascriptInterface
        public void openEmailDraft(String to, String subject, String body) {
            runOnUiThread(() -> {
                try {
                    String mailto = "mailto:" + Uri.encode(to) +
                            "?subject=" + Uri.encode(subject) +
                            "&body=" + Uri.encode(body);
                    handleMailto(mailto);
                } catch (Exception e) {
                    handleMailto("mailto:" + to);
                }
            });
        }

        @JavascriptInterface
        public void openPdfDocument(String url) {
            runOnUiThread(() -> {
                if (url == null || url.isEmpty()) return;
                String targetUrl = url;
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    targetUrl = "https://amreye.in" + (url.startsWith("/") ? url : "/" + url);
                }
                openInExternalBrowser(targetUrl);
            });
        }

        @JavascriptInterface
        public void copyToClipboard(String text) {
            runOnUiThread(() -> {
                try {
                    ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    ClipData clip = ClipData.newPlainText("AMReye.AI", text);
                    if (cm != null) {
                        cm.setPrimaryClip(clip);
                        Toast.makeText(MainActivity.this, "Copied to clipboard", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Copy failed", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void shareText(String title, String text) {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType("text/plain");
                    intent.putExtra(Intent.EXTRA_SUBJECT, title);
                    intent.putExtra(Intent.EXTRA_TEXT, text);
                    startActivity(Intent.createChooser(intent, "Share via"));
                } catch (Exception ignored) {}
            });
        }
    }

    private final class FrontierChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            super.onProgressChanged(view, newProgress);
            if (topProgressBar != null) {
                if (newProgress < 100) {
                    topProgressBar.setVisibility(View.VISIBLE);
                    topProgressBar.setProgress(newProgress);
                } else {
                    topProgressBar.setProgress(100);
                    handler.postDelayed(() -> topProgressBar.setVisibility(View.GONE), 300);
                }
            }
        }

        @Override
        public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
            WebView.HitTestResult result = view.getHitTestResult();
            String url = result != null ? result.getExtra() : null;
            if (url != null && !url.isEmpty()) {
                openInExternalBrowser(url);
                return false;
            }

            WebView tempWebView = new WebView(MainActivity.this);
            tempWebView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                    openInExternalBrowser(req.getUrl().toString());
                    return true;
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView v, String u) {
                    openInExternalBrowser(u);
                    return true;
                }
            });

            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
            transport.setWebView(tempWebView);
            resultMsg.sendToTarget();
            return true;
        }
    }

    private final class FrontierWebClient extends WebViewClient {
        private boolean handleUrl(String url) {
            if (url == null || url.isEmpty()) return false;

            // 1. Handle mailto: links directly to Gmail/email
            if (url.startsWith("mailto:")) {
                handleMailto(url);
                return true;
            }

            // 2. Handle tel: links
            if (url.startsWith("tel:")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception ignored) {}
                return true;
            }

            // 3. Handle PDF documents & downloads -> open in Chrome / system browser
            if (url.endsWith(".pdf") || url.contains("/documents/") || url.endsWith(".csv")) {
                String targetUrl = url;
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    targetUrl = "https://amreye.in" + (url.startsWith("/") ? url : "/" + url);
                }
                openInExternalBrowser(targetUrl);
                return true;
            }

            // Only the live HTTPS origin and packaged HTTPS origin may access this WebView.
            if (!AppUrlPolicy.isTrustedPage(url)) {
                openInExternalBrowser(url);
                return true;
            }

            // Internal navigation
            return false;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleUrl(request.getUrl().toString());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleUrl(url);
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            // Main-frame POST requests do not pass through shouldOverrideUrlLoading.
            if (request.isForMainFrame() && !AppUrlPolicy.isTrustedPage(uri.toString())) {
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked navigation",
                        java.util.Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }

            if (AppUrlPolicy.isLocalPage(uri.toString())) {
                String path = uri.getPath();
                if (path == null || path.isEmpty() || path.equals("/")) {
                    path = "index.html";
                } else if (path.startsWith("/")) {
                    path = path.substring(1);
                }

                try {
                    InputStream stream = getAssets().open(path);
                    String mimeType = getMimeType(path);
                    return new WebResourceResponse(mimeType, "UTF-8", stream);
                } catch (Exception e) {
                    try {
                        InputStream stream = getAssets().open("index.html");
                        return new WebResourceResponse("text/html", "UTF-8", stream);
                    } catch (Exception ignored) {}
                }
            }

            return super.shouldInterceptRequest(view, request);
        }

        private String getMimeType(String path) {
            String lower = path.toLowerCase();
            if (lower.endsWith(".html")) return "text/html";
            if (lower.endsWith(".css")) return "text/css";
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
            if (lower.endsWith(".json")) return "application/json";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".pdf")) return "application/pdf";
            if (lower.endsWith(".webmanifest")) return "application/manifest+json";
            return "application/octet-stream";
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            if (AppUrlPolicy.isTrustedPage(url)) {
                isOnlineModeActive = !AppUrlPolicy.isLocalPage(url);
                hasLoadedSuccessfully = false;
            }
            if (topProgressBar != null) {
                topProgressBar.setVisibility(View.VISIBLE);
                topProgressBar.setProgress(15);
            }
            // Ensure mobile responsive viewport
            view.evaluateJavascript(
                "(function(){" +
                "var m=document.querySelector('meta[name=viewport]');" +
                "if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}" +
                "m.setAttribute('content','width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');" +
                "})();", null);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            // Failed live loads can finish after the local fallback has already started.
            if (!AppUrlPolicy.isTrustedPage(url)
                    || AppUrlPolicy.isLocalPage(url) == isOnlineModeActive
                    || !url.equals(view.getUrl())) return;
            hasLoadedSuccessfully = true;
            if (topProgressBar != null) {
                topProgressBar.setProgress(100);
                handler.postDelayed(() -> topProgressBar.setVisibility(View.GONE), 300);
            }
            injectFrontierEnhancer(view);
            dismissFrontierSplash();
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame() && isOnlineModeActive) {
                loadOfflineApplication();
            }
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
            super.onReceivedHttpError(view, request, response);
            if (request.isForMainFrame() && isOnlineModeActive && response.getStatusCode() >= 400) {
                loadOfflineApplication();
            }
        }
    }
}
