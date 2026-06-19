package com.emagiz.config;

public class MailConfig {
    private MailConfig() {}

    public static String get(String key, String defaultValue) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? defaultValue : v;
    }

    public static String getHost()   { return get("SMTP_HOST", "mailhog"); }
    public static int    getPort()   { return Integer.parseInt(get("SMTP_PORT", "1025")); }
    public static String getUsername(){ return get("SMTP_USERNAME", ""); }
    public static String getPassword(){ return get("SMTP_PASSWORD", ""); }
    public static String getFrom()   { return get("SMTP_FROM", "no-reply@localhost"); }
    public static String getFrontendResetUrl(){ return get("FRONTEND_RESET_URL",
            "http://localhost/#/reset-password"); }
}
