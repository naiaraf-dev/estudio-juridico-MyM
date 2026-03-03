import { Resend } from "resend";

// ─── Helpers de validación ───────────────────────────────────────────────────

function validateName(name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && name.length >= 4;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateJurisdiction(j) {
    return ["caba", "pba"].includes(j);
}

function validateMessage(msg) {
    return msg.trim().length >= 10;
}

function sanitize(str) {
    return String(str ?? "")
        .trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ─── Templates HTML ──────────────────────────────────────────────────────────

/**
 * Mail que recibe el ESTUDIO con los datos de la consulta.
 */
function adminTemplate({ name, email, jurisdiction, area, message }) {
    const jurisdictionLabel = jurisdiction === "caba" ? "CABA" : "Provincia de Buenos Aires";
    const areaLabels = {
        dont_know: "No estoy segura/o — Necesito asesoramiento",
        derecho_familia: "Derecho de Familia",
        contratos: "Contratos",
        sucesiones: "Sucesiones",
        derecho_penal: "Derecho Penal",
        derechos_reales: "Derechos Reales",
        derecho_consumidor: "Derecho del Consumidor",
    };
    const areaLabel = areaLabels[area] ?? area ?? "—";

    return /* html */ `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:30px 0;">
        <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;
                        box-shadow:0 4px 20px rgba(0,0,0,0.10);">

            <!-- HEADER -->
            <tr>
                <td style="background:#587997;padding:32px 40px;text-align:center;">
                <img src="https://res.cloudinary.com/dcrxap2ua/image/upload/v1772497329/mm_logo2_dmdmlh.png"
                    alt="Estudio Jurídico M&amp;M"
                    style="max-width:160px;height:auto;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;">
                <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:600;letter-spacing:0.5px;">
                    Nueva consulta desde el sitio web
                </h1>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">
                    Estudio Jurídico M&amp;M
                </p>
                </td>
            </tr>

            <!-- ALERTA -->
            <tr>
                <td style="background:#d9b87e;padding:12px 40px;text-align:center;">
                <p style="margin:0;color:#3d3010;font-size:13px;font-weight:600;">
                    📩 Hay una nueva consulta pendiente de respuesta
                </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:36px 40px;">

                <!-- Datos del cliente -->
                <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#f7f9fc;border-radius:8px;padding:0;margin-bottom:24px;border:1px solid #e3eaf1;">
                    <tr>
                    <td style="padding:20px 24px;">
                        <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;
                                letter-spacing:1px;color:#587997;">Datos del consultante</p>

                        <table width="100%" cellpadding="0" cellspacing="0">
                        ${row("👤 Nombre", name)}
                        ${row("📧 Email", `<a href="mailto:${email}" style="color:#587997;">${email}</a>`)}
                        ${row("⚖️ Jurisdicción", jurisdictionLabel)}
                        ${row("📂 Área", areaLabel)}
                        </table>
                    </td>
                    </tr>
                </table>

                <!-- Mensaje -->
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;
                            letter-spacing:1px;color:#587997;">Mensaje</p>
                <div style="background:#f7f9fc;border-left:4px solid #587997;border-radius:0 8px 8px 0;
                            padding:18px 20px;font-size:15px;line-height:1.7;color:#333;white-space:pre-wrap;">
    ${message}
                </div>

                <!-- CTA -->
                <div style="margin-top:28px;text-align:center;">
                    <a href="mailto:${email}?subject=Re:%20Tu%20consulta%20en%20Estudio%20Jur%C3%ADdico%20M%26M"
                    style="display:inline-block;background:#587997;color:#ffffff;text-decoration:none;
                            padding:13px 30px;border-radius:25px;font-size:14px;font-weight:600;">
                    Responder consulta
                    </a>
                </div>

                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="background:#587997;padding:18px 40px;text-align:center;">
                <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;">
                    © 2024 Estudio Jurídico M&amp;M — Todos los derechos reservados.<br>
                    Este mensaje fue generado automáticamente desde el formulario de contacto del sitio web.
                </p>
                </td>
            </tr>

            </table>
        </td>
        </tr>
    </table>

    </body>
    </html>`;
}

/**
 * Auto-respuesta que recibe el USUARIO.
 */
function userTemplate({ name, email, jurisdiction, area, message }) {
    const jurisdictionLabel = jurisdiction === "caba" ? "CABA" : "Provincia de Buenos Aires";
    const areaLabels = {
        dont_know: "Asesoramiento general",
        derecho_familia: "Derecho de Familia",
        contratos: "Contratos",
        sucesiones: "Sucesiones",
        derecho_penal: "Derecho Penal",
        derechos_reales: "Derechos Reales",
        derecho_consumidor: "Derecho del Consumidor",
    };
    const areaLabel = areaLabels[area] ?? area ?? "—";

    return /* html */ `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:30px 0;">
        <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;
                        box-shadow:0 4px 20px rgba(0,0,0,0.10);">

            <!-- HEADER -->
            <tr>
                <td style="background:#587997;padding:32px 40px;text-align:center;">
                <img src="https://res.cloudinary.com/dcrxap2ua/image/upload/v1772497329/mm_logo2_dmdmlh.png"
                    alt="Estudio Jurídico M&amp;M"
                    style="max-width:160px;height:auto;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;">
                <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:600;letter-spacing:0.5px;">
                    Recibimos tu consulta
                </h1>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">
                    Estudio Jurídico M&amp;M
                </p>
                </td>
            </tr>

            <!-- BANNER DORADO -->
            <tr>
                <td style="background:#d9b87e;padding:12px 40px;text-align:center;">
                <p style="margin:0;color:#3d3010;font-size:13px;font-weight:600;">
                    ✅ Tu consulta fue enviada exitosamente
                </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:36px 40px;">

                <p style="font-size:16px;color:#1a1a1a;margin:0 0 16px;">
                    Hola <strong>${name}</strong>,
                </p>
                <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
                    Gracias por contactarte con <strong>Estudio Jurídico M&amp;M</strong>.
                    Hemos recibido tu consulta y nos pondremos en contacto con vos a la brevedad
                    para darte la asistencia que necesitás.
                </p>

                <!-- Resumen -->
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;
                            letter-spacing:1px;color:#587997;">Resumen de tu consulta</p>
                <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#f7f9fc;border-radius:8px;border:1px solid #e3eaf1;margin-bottom:24px;">
                    <tr>
                    <td style="padding:20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                        ${row("Nombre", name)}
                        ${row("Email", email)}
                        ${row("Jurisdicción", jurisdictionLabel)}
                        ${row("Área", areaLabel)}
                        </table>
                    </td>
                    </tr>
                </table>

                <!-- Mensaje enviado -->
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;
                            letter-spacing:1px;color:#587997;">Tu mensaje</p>
                <div style="background:#f7f9fc;border-left:4px solid #d9b87e;border-radius:0 8px 8px 0;
                            padding:18px 20px;font-size:14px;line-height:1.7;color:#555;white-space:pre-wrap;">
    ${message}
                </div>

                <!-- Contacto directo -->
                <div style="margin-top:30px;background:#f7f9fc;border-radius:8px;padding:20px 24px;
                            border:1px solid #e3eaf1;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;color:#666;">¿Necesitás contactarnos directamente?</p>
                    <a href="mailto:montoyamoralesabogadas@gmail.com"
                    style="color:#587997;font-size:14px;font-weight:600;text-decoration:none;">
                    📧 montoyamoralesabogadas@gmail.com
                    </a>
                </div>

                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="background:#587997;padding:22px 40px;text-align:center;">
                <p style="margin:0 0 8px;color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;">
                    Estudio Jurídico M&amp;M
                </p>
                <p style="margin:0 0 12px;color:rgba(255,255,255,0.6);font-size:11px;">
                    Habilitadas en CABA y Provincia de Buenos Aires
                </p>
                <p style="margin:0;color:rgba(255,255,255,0.45);font-size:10px;">
                    © 2024 Estudio Jurídico M&amp;M — Todos los derechos reservados.<br>
                    Este es un correo automático, por favor no responder a esta dirección.
                </p>
                </td>
            </tr>

            </table>
        </td>
        </tr>
    </table>

    </body>
    </html>`;
}

// Helper para filas de tabla dentro del email
function row(label, value) {
    return `
        <tr>
        <td style="padding:5px 0;font-size:13px;color:#888;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${value}</td>
        </tr>`;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req, res) {
    // Solo POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");

    // Env vars
    const API_KEY    = process.env.RESEND_API_KEY;
    const MAIL_TO    = process.env.MAIL_TO;
    const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const FROM_NAME  = process.env.FROM_NAME  || "Estudio M&M";

    if (!API_KEY || !MAIL_TO) {
        console.error("Missing env vars: RESEND_API_KEY or MAIL_TO");
        return res.status(500).json({ error: "Email service not configured" });
    }

    // Parsear body
    const { name, email, jurisdiction, area, message } = req.body ?? {};

    // Sanitizar
    const s = {
        name:         sanitize(name),
        email:        sanitize(email),
        jurisdiction: sanitize(jurisdiction),
        area:         sanitize(area),
        message:      sanitize(message),
    };

    // Validar
    if (!validateName(s.name)) {
        return res.status(400).json({ error: "Nombre inválido. Ingresá nombre y apellido." });
    }
    if (!validateEmail(s.email)) {
        return res.status(400).json({ error: "Email inválido." });
    }
    if (!validateJurisdiction(s.jurisdiction)) {
        return res.status(400).json({ error: "Jurisdicción inválida." });
    }
    if (!validateMessage(s.message)) {
        return res.status(400).json({ error: "El mensaje debe tener al menos 10 caracteres." });
    }

    const resend = new Resend(API_KEY);

    // 1) Mail al estudio
    try {
        await resend.emails.send({
        from:    `${FROM_NAME} <${FROM_EMAIL}>`,
        to:      [MAIL_TO],
        reply_to: s.email,
        subject: `Nueva consulta web — ${s.name} (${s.jurisdiction.toUpperCase()})`,
        html:    adminTemplate(s),
        });
    } catch (err) {
        console.error("Admin mail error:", err);
        return res.status(500).json({ error: "Error al enviar el mail al estudio." });
    }

    // 2) Auto-respuesta al usuario
    try {
        await resend.emails.send({
        from:    `${FROM_NAME} <${FROM_EMAIL}>`,
        to:      [s.email],
        subject: "Hemos recibido tu consulta — Estudio Jurídico M&M",
        html:    userTemplate(s),
        });
    } catch (err) {
        // No es crítico: el mail del estudio ya fue enviado
        console.warn("User auto-reply error (non-critical):", err);
    }

    return res.status(200).json({ ok: true, message: "Consulta enviada exitosamente." });
}