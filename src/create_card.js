const { publicEncrypt, constants } = require("crypto");

// Публичный ключ
var publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv5yse9ka3ZQE0feuGtemYv3IqOlLck8zHUM7lTr0za6lXTszRSXfUO7jMb+L5C7e2QNFs+7sIX2OQJ6a+HG8kr+jwJ4tS3cVsWtd9NXpsU40PE4MeNr5RqiNXjcDxA+L4OsEm/BlyFOEOh2epGyYUd5/iO3OiQFRNicomT2saQYAeqIwuELPs1XpLk9HLx5qPbm8fRrQhjeUD5TLO8b+4yCnObe8vy/BMUwBfq+ieWADIjwWCMp2KTpMGLz48qnaD9kdrYJ0iyHqzb2mkDhdIzkim24A3lWoYitJCBrrB2xM05sm9+OdCI1f7nPNJbl5URHobSwR94IRGT7CJcUjvwIDAQAB\n-----END PUBLIC KEY-----";

function encryptCardData(publicKey, cardData) {
    if (!publicKey) throw new Error("X509Key is missing");

    const encryptedBuffer = publicEncrypt(
        { key: publicKey, padding: constants.RSA_PKCS1_PADDING },
        Buffer.from(
            Object.entries(cardData)
                .map(([key, data]) => `${key}=${data}`)
                .join(";"),
            "utf-8"
        )
    );

    return encryptedBuffer.toString("base64");
}


const cardData = {
    PAN: "2200770239097761",
    CardHolder:"IVAN PETROV",
    ExpDate: "1225",
    CVV: "123",
};

try {
    const encryptedData = encryptCardData(publicKey, cardData);
    console.log(cardData)
    console.log(encryptedData);
} catch (error) {
    console.error("Error encrypting card data:", error);
}
