package com.emagiz.config;

public class MailConfig {
    private MailConfig() {}

    public static String get(String key, String defaultValue) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? defaultValue : v;
    }

    public static String getHost()    { return get("SMTP_HOST",     "smtp.gmail.com"); }
    public static int    getPort()    { return Integer.parseInt(get("SMTP_PORT", "587")); }

    public static String getUsername(){ return get("SMTP_USERNAME", "default@example.com"); }
    public static String getPassword(){ return get("SMTP_PASSWORD", ""); }
    public static String getFrom()    { return get("SMTP_FROM",     "default@example.com"); }

    public static String getFrontendResetUrl(){ return get("FRONTEND_RESET_URL", "http://localhost/#/reset-password"); }
}