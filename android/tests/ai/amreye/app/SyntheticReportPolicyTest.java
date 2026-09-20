package ai.amreye.app;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public final class SyntheticReportPolicyTest {
    private static int checks;
    public static void main(String[] args) {
        require("application/json".equals(SyntheticReportPolicy.mimeType("json")), "JSON MIME");
        require("text/csv".equals(SyntheticReportPolicy.mimeType("csv")), "CSV MIME");
        require("AMReye-AI-synthetic-report.json".equals(SyntheticReportPolicy.fileName("json")), "Safe filename");
        for (String format : new String[] {null, "", "JSON", "pdf", "../../data", "csv.exe"}) {
            require(SyntheticReportPolicy.encode(format, "test") == null, "Unsafe format accepted");
            require(SyntheticReportPolicy.fileName(format) == null, "Unsafe filename generated");
        }
        require(SyntheticReportPolicy.encode("json", null) == null, "Null report");
        require(SyntheticReportPolicy.encode("csv", "") == null, "Empty report");
        String unicode = "Synthetic example: μm";
        require(unicode.equals(new String(SyntheticReportPolicy.encode("csv", unicode), StandardCharsets.UTF_8)), "UTF-8 round trip");
        char[] limit = new char[SyntheticReportPolicy.MAX_BYTES];
        Arrays.fill(limit, 'a');
        require(SyntheticReportPolicy.encode("csv", new String(limit)).length == SyntheticReportPolicy.MAX_BYTES, "Exact byte limit");
        require(SyntheticReportPolicy.encode("json", new String(limit) + "a") == null, "Oversized ASCII report");
        Arrays.fill(limit, 'μ');
        require(SyntheticReportPolicy.encode("csv", new String(limit)) == null, "Oversized UTF-8 report");
        System.out.println("SyntheticReportPolicy: " + checks + " format, filename and byte-limit cases passed.");
    }

    private static void require(boolean condition, String message) {
        checks++;
        if (!condition) throw new AssertionError(message);
    }
}
