/**
 * @name ServerListScroll
 * @version 1.0.0
 * @description Permet de faire défiler la liste des serveurs avec la molette de la souris.
 * @author VotreNom
 */

module.exports = class ServerListScroll {
    start() {
        this.addScrollListener();
    }

    stop() {
        this.removeScrollListener();
    }

    addScrollListener() {
        // Sélectionne la liste des serveurs
        const serverList = document.querySelector(".sidebar-2K8pFh");

        if (serverList) {
            // Ajoute un écouteur pour l'événement de défilement de la molette
            serverList.addEventListener("wheel", this.onScroll);
        }
    }

    removeScrollListener() {
        const serverList = document.querySelector(".sidebar-2K8pFh");

        if (serverList) {
            serverList.removeEventListener("wheel", this.onScroll);
        }
    }

    onScroll(event) {
        // Ajuste le défilement vertical en fonction de la direction de la molette
        event.currentTarget.scrollTop += event.deltaY;
    }
};
