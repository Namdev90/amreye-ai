package ai.amreye.app;

import java.nio.charset.StandardCharsets;

/** Fixed-format, size-bounded exports; the system picker owns the destination. */
final class SyntheticReportPolicy {
    static final int MAX_BYTES = 1024 * 1024;
    private SyntheticReportPolicy() {}

    static String mimeType(String format) {
        if ("json".equals(format)) return "application/json";
        if ("csv".equals(format)) return "text/csv";
        return null;
    }

    static String fileName(String format) {
        return mimeType(format) == null ? null : "AMReye-AI-synthetic-report." + format;
    }

    static byte[] encode(String format, String text) {
        if (mimeType(format) == null || text == null || text.isEmpty() || text.length() > MAX_BYTES) return null;
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        return bytes.length <= MAX_BYTES ? bytes : null;
    }
}
