package ai.amreye.app;

public final class AppUrlPolicyTest {
    private static int checks;
    public static void main(String[] args) {
        String[] trusted = {
            "https://amreye.in/#home", "https://AMREYE.IN:443/path?q=1#demo",
            "https://appassets.androidplatform.net/index.html#hub"
        };
        for (String url : trusted) require(AppUrlPolicy.isTrustedPage(url), "Trusted page rejected: " + url);

        String[] untrusted = {
            null, "", "//amreye.in/", "https://amreye.in.attacker.example/",
            "https://evil-amreye.in/", "https://androidplatform.net/", "https://localhost/",
            "https://appassets.androidplatform.net.attacker.example/", "http://amreye.in/",
            "https://amreye.in:8443/", "https://user@amreye.in/", "https://amreye.in@attacker.example/",
            "javascript:alert(1)", "file:///sdcard/test.html", "content://test", "data:text/html,test",
            "intent://amreye.in/", "https://amreye.in\\@attacker.example/"
        };
        for (String url : untrusted) require(!AppUrlPolicy.isTrustedPage(url), "Untrusted page accepted: " + url);

        require(AppUrlPolicy.isLocalPage(trusted[2]), "Packaged page not local");
        require(!AppUrlPolicy.isLocalPage(trusted[0]), "Live page treated as local");
        require(!AppUrlPolicy.isLocalPage(null), "Null page treated as local");
        require(AppUrlPolicy.isWebUrl("https://example.org/document.pdf"), "External HTTPS rejected");
        require(AppUrlPolicy.isWebUrl("http://example.org/"), "External HTTP rejected");
        for (String url : new String[] {null, "", "mailto:a@example.org", "javascript:alert(1)", "file:///tmp/a", "intent://example.org", "https://user@example.org"}) {
            require(!AppUrlPolicy.isWebUrl(url), "Unsafe outbound URL accepted: " + url);
        }
        for (String url : new String[] {
                "/documents/amreye-compendium.pdf", "documents/amreye-compendium.pdf",
                "https://appassets.androidplatform.net/documents/amreye-compendium.pdf",
                "https://amreye.in/documents/amreye-compendium.pdf",
                "/documents/amreye-compendium.pdf#page=2",
                "https://appassets.androidplatform.net/documents/amreye-compendium.pdf#page=11",
                "https://amreye.in/documents/amreye-compendium.pdf#page=300"}) {
            require(AppUrlPolicy.isBundledCompendium(url), "Bundled document not routed locally: " + url);
        }
        for (String url : new String[] {
                null, "", "/documents/other.pdf", "/documents/../amreye-compendium.pdf",
                "/documents/%61mreye-compendium.pdf", "/documents/amreye-compendium.pdf?file=other",
                "/documents/amreye-compendium.pdf#page=0", "/documents/amreye-compendium.pdf#page=301",
                "/documents/amreye-compendium.pdf#page=-1", "/documents/amreye-compendium.pdf#page=1&file=other",
                "/documents/amreye-compendium.pdf#page=1.5", "/documents/amreye-compendium.pdf#page=999999999999999999",
                "/documents/amreye-compendium.pdf#page=%31", "/documents/amreye-compendium.pdf#page=01",
                "//evil.example/documents/amreye-compendium.pdf",
                "https://evil.example/documents/amreye-compendium.pdf", "http://amreye.in/documents/amreye-compendium.pdf",
                "https://amreye.in:8443/documents/amreye-compendium.pdf", "file:///documents/amreye-compendium.pdf"}) {
            require(!AppUrlPolicy.isBundledCompendium(url), "Untrusted document routed locally: " + url);
        }
        require(AppUrlPolicy.canReadCompendium(AppUrlPolicy.COMPENDIUM_CONTENT_URI, "r"), "Compendium read denied");
        for (String mode : new String[] {null, "", "w", "wt", "wa", "rw", "rwt"}) {
            require(!AppUrlPolicy.canReadCompendium(AppUrlPolicy.COMPENDIUM_CONTENT_URI, mode), "Write mode allowed: " + mode);
        }
        for (String url : new String[] {
                null, "content://ai.amreye.app.documents/other.pdf",
                "content://ai.amreye.app.documents/../amreye-compendium.pdf",
                "content://ai.amreye.app.documents/%61mreye-compendium.pdf",
                AppUrlPolicy.COMPENDIUM_CONTENT_URI + "?path=other",
                AppUrlPolicy.COMPENDIUM_CONTENT_URI + "#page=2",
                "content://evil.example/amreye-compendium.pdf", "/amreye-compendium.pdf"}) {
            require(!AppUrlPolicy.canReadCompendium(url, "r"), "Untrusted content URI allowed: " + url);
        }
        System.out.println("AppUrlPolicy: " + checks + " navigation, document routing and read-only access cases passed.");
    }

    private static void require(boolean condition, String message) {
        checks++;
        if (!condition) throw new AssertionError(message);
    }
}
