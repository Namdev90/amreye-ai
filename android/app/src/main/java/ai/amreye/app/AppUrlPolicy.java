package ai.amreye.app;

import java.net.URI;
import java.net.URISyntaxException;

/** URI policy shared by native navigation and the packaged-asset handler. */
final class AppUrlPolicy {
    static final String COMPENDIUM_ASSET = "documents/amreye-compendium.pdf";
    static final String COMPENDIUM_CONTENT_URI = "content://ai.amreye.app.documents/amreye-compendium.pdf";
    private AppUrlPolicy() {}

    static boolean isWebUrl(String value) {
        URI uri = parse(value);
        return uri != null && uri.getHost() != null && uri.getRawUserInfo() == null
                && ("https".equalsIgnoreCase(uri.getScheme()) || "http".equalsIgnoreCase(uri.getScheme()));
    }

    static boolean isTrustedPage(String value) {
        URI uri = parse(value);
        if (uri == null || !"https".equalsIgnoreCase(uri.getScheme()) || uri.getRawUserInfo() != null
                || (uri.getPort() != -1 && uri.getPort() != 443)) return false;
        return "amreye.in".equalsIgnoreCase(uri.getHost())
                || "appassets.androidplatform.net".equalsIgnoreCase(uri.getHost());
    }

    static boolean isLocalPage(String value) {
        URI uri = parse(value);
        return isTrustedPage(value) && "appassets.androidplatform.net".equalsIgnoreCase(uri.getHost());
    }

    static boolean isBundledCompendium(String value) {
        URI uri = parse(value);
        if (uri == null || uri.getRawQuery() != null) return false;
        String fragment = uri.getRawFragment();
        if (fragment != null && (!fragment.matches("page=[1-9][0-9]{0,2}")
                || Integer.parseInt(fragment.substring(5)) > 300)) return false;
        String path = uri.getRawPath();
        if (!("/" + COMPENDIUM_ASSET).equals(path) && !COMPENDIUM_ASSET.equals(path)) return false;
        return (uri.getScheme() == null && uri.getRawAuthority() == null) || isTrustedPage(value);
    }

    static boolean canReadCompendium(String value, String mode) {
        return COMPENDIUM_CONTENT_URI.equals(value) && "r".equals(mode);
    }

    private static URI parse(String value) {
        if (value == null || value.isEmpty()) return null;
        try {
            return new URI(value);
        } catch (URISyntaxException ignored) {
            return null;
        }
    }
}
