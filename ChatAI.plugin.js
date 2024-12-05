/**
 * @name ChatAI
 * @author VotreNom
 * @description Plugin BetterDiscord pour intégrer une IA de chat (comme ChatGPT).
 * @version 1.0.1
 * @source https://votre-repo-ou-lien-github
 */

module.exports = class ChatAI {
    constructor() {
        this.config = {
            info: {
                name: "ChatAI",
                authors: [{ name: "VotreNom" }],
                version: "1.0.1",
                description: "Plugin pour discuter avec une IA directement dans Discord.",
            },
        };
        this.apiKey = "VOTRE_API_KEY"; // Remplacez par votre clé API.
    }

    start() {
        // Vérifie si la clé API a été configurée
        if (this.apiKey === "VOTRE_API_KEY") {
            BdApi.alert(
                "Configuration requise",
                "⚠️ Vous devez configurer une clé API avant d'utiliser ChatAI. Modifiez la variable `apiKey` dans le fichier du plugin avec votre clé API OpenAI."
            );
        } else {
            BdApi.showToast("ChatAI Plugin activé !", { type: "info" });
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
        if (this.apiKey === "VOTRE_API_KEY") {
            return "⚠️ La clé API n'est pas configurée. Veuillez modifier le plugin avec une clé API valide.";
        }

        const url = "https://api.openai.com/v1/completions";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
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
};
