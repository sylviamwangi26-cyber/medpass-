// services/SMSService.js

class SMSService {
    sendSMS(phone, message) {
        if (!phone) return console.log(`[SMS ERROR] No phone number for message: ${message}`);

        console.log(`\x1b[33m[SMS SENT TO ${phone}]\x1b[0m ${message}`);

        // This is a mock. In production, you would use Twilio or Africa's Talking API.
        // Example:
        // twilioClient.messages.create({ body: message, to: phone, from: '+123456789' });
    }

    sendWelcomeMessage(name, phone, uniqueId, lang = 'EN') {
        const msg = lang === 'SW'
            ? `Karibu ${name} kwenye MedPass! ID yako ya kipekee ya Medical Passport ni ${uniqueId}. Itunze kwa ajili ya huduma za matibabu za kimataifa.`
            : `Welcome ${name} to MedPass! Your Unique Medical Passport ID is ${uniqueId}. This identity ensures you are recognized in any partner hospital globally. Keep it safe.`;

        console.log(`\n\x1b[36m🤖 [AI DIGITAL HEALTH AGENT]\x1b[0m`);
        console.log(`\x1b[34m📥 New Patient Onboarding: ${name}\x1b[0m`);
        this.sendSMS(phone, msg);
        console.log(`\x1b[36m--------------------------------------------------\x1b[0m\n`);
    }

    sendResultNotification(name, phone, testType, lang = 'EN') {
        const msg = lang === 'SW'
            ? `Habari ${name}, matokeo yako ya ${testType} sasa yako tayari na yametumwa kwa daktari wako. Yaone kwenye MedPass portal.`
            : `Hello ${name}, your ${testType} results are now ready and sent to your doctor. View them in your MedPass portal.`;
        this.sendSMS(phone, msg);
    }

    sendBillingNotification(name, phone, amount, lang = 'EN') {
        const msg = lang === 'SW'
            ? `Habari ${name}, bili mpya ya KES ${amount} imetolewa. Tumia Bima ya MedPass kulipa.`
            : `Hello ${name}, a new bill of KES ${amount} has been generated. Use MedPass Insurance to pay.`;
        this.sendSMS(phone, msg);
    }
}

module.exports = new SMSService();
