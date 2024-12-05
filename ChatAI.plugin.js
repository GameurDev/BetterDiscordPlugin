/**
 * @name ChatAI
 * @author VotreNom
 * @description Plugin BetterDiscord pour intégrer une IA de chat (comme ChatGPT), avec configuration persistante de la clé API.
 * @version 1.0.3
 * @source https://github.com/GameurDev/BetterDiscordPlugin
 */

module.exports = class ChatAI {
    constructor() {
        this.config = {
            info: {
                name: "ChatAI",
                authors: [{ name: "VotreNom" }],
                version: "1.0.3",
                description: "Plugin pour discuter avec une IA directement dans Discord.",
            },
        };
        this.pluginName = "ChatAI";
        this.defaultKeyMessage = "⚠️ Vous devez configurer une clé API avant d'utiliser ChatAI. Cliquez sur l'icône du plugin dans les paramètres pour la configurer.";
    }

    start() {
        const storedApiKey = BdApi.Data.load(this.pluginName, "apiKey");
        if (!storedApiKey) {
            BdApi.alert(
                "Configuration requise",
                this.defaultKeyMessage
            );
        } else {
            this.apiKey = storedApiKey;
            BdApi.showToast("ChatAI Plugin activé avec votre clé API !", { type: "info" });
            this.injectChatBox();
        }
    }

    stop() {
        BdApi.showToast("ChatAI Plugin désactivé !", { type: "error" });
        this.removeChatBox();
    }

    injectChatBox() {
        const chatArea = document.querySelector(".chat-3bRxxu"); // Sélecteur CSS pour la zone de chat.
        if (chatArea) {
            const chatBox = document.createElement("div");
            chatBox.id = "chat-ai-box";
            chatBox.style.marginTop = "10px";
            chatBox.innerHTML = `
                <textarea id="chat-ai-input" placeholder="Posez une question à l'IA" style="width: 100%;"></textarea>
                <button id="chat-ai-send" style="margin-top: 5px;">Envoyer</button>
            `;
            chatArea.appendChild(chatBox);

            document
                .getElementById("chat-ai-send")
                .addEventListener("click", this.handleChatAIRequest.bind(this));
        }
    }

    removeChatBox() {
        const chatBox = document.getElementById("chat-ai-box");
        if (chatBox) chatBox.remove();
    }

    async handleChatAIRequest() {
        const input = document.getElementById("chat-ai-input").value;
        if (!input) return alert("Veuillez écrire une question !");
        
        const response = await this.queryAI(input);
        alert(response); // Affiche la réponse dans une alerte. Vous pouvez l'intégrer ailleurs.
    }

    async queryAI(query) {
        const apiKey = BdApi.Data.load(this.pluginName, "apiKey");
        if (!apiKey) {
            return this.defaultKeyMessage;
        }

        const url = "https://api.openai.com/v1/completions";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: query,
                    max_tokens: 150,
                }),
            });

            const data = await response.json();
            return data.choices[0]?.text || "Erreur lors de la réponse.";
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API OpenAI :", error);
            return "❌ Une erreur s'est produite lors de la requête à l'API.";
        }
    }

    getSettingsPanel() {
        const apiKey = BdApi.Data.load(this.pluginName, "apiKey") || "";

        const wrapper = document.createElement("div");
        wrapper.style.padding = "10px";

        const label = document.createElement("label");
        label.textContent = "Clé API OpenAI :";
        label.style.display = "block";
        label.style.marginBottom = "5px";

        const input = document.createElement("input");
        input.type = "text";
        input.value = apiKey;
        input.style.width = "100%";
        input.style.marginBottom = "10px";
        input.placeholder = "Entrez votre clé API ici";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Enregistrer";
        saveButton.style.display = "block";

        saveButton.onclick = () => {
            const newKey = input.value.trim();
            if (newKey) {
                BdApi.Data.save(this.pluginName, "apiKey", newKey);
                BdApi.showToast("Clé API enregistrée avec succès !", { type: "success" });
            } else {
                BdApi.showToast("La clé API est vide. Veuillez réessayer.", { type: "error" });
            }
        };

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(saveButton);

        return wrapper;
    }
};
