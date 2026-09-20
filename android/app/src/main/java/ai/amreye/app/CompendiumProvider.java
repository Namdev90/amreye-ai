package ai.amreye.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/** Shares only the packaged project compendium, with a temporary read grant. */
public final class CompendiumProvider extends ContentProvider {
    private File cachedFile;

    @Override public boolean onCreate() { return true; }

    private void requireCompendium(Uri uri) {
        if (uri == null || !AppUrlPolicy.canReadCompendium(uri.toString(), "r")) {
            throw new IllegalArgumentException("Unknown document");
        }
    }

    private synchronized File cachedCompendium() throws IOException {
        if (cachedFile != null && cachedFile.isFile()) return cachedFile;
        File directory = new File(getContext().getCacheDir(), "shared-documents");
        if (!directory.isDirectory() && !directory.mkdirs()) throw new IOException("Cannot create document cache");
        File temporary = File.createTempFile("compendium-", ".pdf", directory);
        try {
            try (InputStream input = getContext().getAssets().open(AppUrlPolicy.COMPENDIUM_ASSET);
                 FileOutputStream output = new FileOutputStream(temporary)) {
                byte[] buffer = new byte[16384];
                int count;
                while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
            }
            File destination = new File(directory, "amreye-compendium.pdf");
            if (destination.exists() && !destination.delete()) throw new IOException("Cannot replace document cache");
            if (!temporary.renameTo(destination)) throw new IOException("Cannot prepare document cache");
            cachedFile = destination;
            return destination;
        } finally {
            if (temporary.exists()) temporary.delete();
        }
    }

    @Override public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        if (uri == null || !AppUrlPolicy.canReadCompendium(uri.toString(), mode)) {
            throw new FileNotFoundException("Only the packaged compendium may be opened read-only");
        }
        try {
            return ParcelFileDescriptor.open(cachedCompendium(), ParcelFileDescriptor.MODE_READ_ONLY);
        } catch (IOException error) {
            throw new FileNotFoundException("Cannot open the packaged compendium");
        }
    }

    @Override public String getType(Uri uri) {
        requireCompendium(uri);
        return "application/pdf";
    }

    @Override public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        requireCompendium(uri);
        String[] columns = projection == null
                ? new String[] {OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE} : projection;
        MatrixCursor cursor = new MatrixCursor(columns, 1);
        Object[] values = new Object[columns.length];
        for (int i = 0; i < columns.length; i++) {
            if (OpenableColumns.DISPLAY_NAME.equals(columns[i])) values[i] = "amreye-compendium.pdf";
            if (OpenableColumns.SIZE.equals(columns[i])) {
                try { values[i] = cachedCompendium().length(); } catch (IOException ignored) { values[i] = null; }
            }
        }
        cursor.addRow(values);
        return cursor;
    }

    @Override public Uri insert(Uri uri, ContentValues values) { throw new UnsupportedOperationException("Read-only provider"); }
    @Override public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) { throw new UnsupportedOperationException("Read-only provider"); }
    @Override public int delete(Uri uri, String selection, String[] selectionArgs) { throw new UnsupportedOperationException("Read-only provider"); }
}
