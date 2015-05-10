
PROJET TECHNOLOGIES WEB 2 
Année 2015
_____________________________

Étudiant: Barthélémy DELEMOTTE  (Groupe 2)
          barthelemy.delemotte@gmail.com

Malgrè le fait que je sois dans le groupe 2, je n'ai que accès au projet
"TW2 Groupe 4" sur PROF.
J'ai envoyé des mails à plusieurs enseignants de l'UE, sans réponse.
Je vous prie de bien vouloir transférer mon rendu au groupe 2.

_____________________________
Contenu de l'archive:
  
  Vous trouverez plusieurs dossiers à la racine de l'archive : scripts/, sql/ et site/.

  site/ est la racine du site web.
  Les autres contiennent des scripts utiles pendant le développement.

  site/ contient:

    library/        : la biblioteque PHP du site (le back-end)
    views/          : des fichiers PHP à inclure, pour générer des morceaux de HTML génériques.
    js/             : le code javascript "front-end"
    css/ et images/ : des fichiers statiques pour le design de l'interface
    thumbnails/     : les versions 300x300 des images de la phototèque
    *.php           : les différents points d'entrée du site web (index.php, APIs,...)

______________________________
Généralités:

Le site est accessible sur http://webtp.fil.univ-lille1.fr/~delemotte/
à condition d'être connecté à Lille 1 ou sur son VPN.

La partie 'recherche' et 'affichage' de photos se fait sur une seule page (index.php), grâce à
une fonction de recherche avancée.
Cette recherche fonctionne sur le principe de l'intersection, tous les critères sont combinables.
Si aucun critère n'est spécifié, toutes les images seront retournées.

La page est controllée par un code javascript développé avec le schéma Model-View-Controller.
La page n'est donc jamais entierement rechargée.

Il existe deux autres pages 'login' et 'signin', dont les fonctions n'ont pas besoin d'être expliquées.

_____________________________
Fonctionnalités:

  - Recherche avancée multi-critères
  - Récupération des images 10 par 10, mise-à-jour automatique quand la souris "scroll" en bas de page.

  - Gestion des comptes utilisateurs (via "Log in" et "Sign in" dans le menu haut)
  - Chaque utilisateur possède une collection de favoris.
  - Pour ajouter une image à votre collection, il faut s'authentifier, puis au survol d'une image,
    cliquer sur le '+' en haut à gauche de celle-ci.
  - Pour consulter la collection d'un utilisateur, il faut utiliser le critère de recherche 'user'

  - Mode diaporama à la manière de Google-Image. (Au survol d'une image, cliquez sur 'View image')
  - Redimensionnement dynamique des images en fonction de l'écran.
    Essayez de redimensionner la fenêtre en mode diaporama avec une grande image :)
  - En mode diaporama: visualisation, suppression et ajout dynamique des mots-cléfs
    (les petits encadrés jaunes en bas de l'image)

  - Le web service demandé par le sujet (et intensément utilisé par le javascript) est implémenté
    par l'API 'image-search.php' à la racine du site.

Limites:
  - Pas de gestion multi-langues 
  - Pas adapté aux smartphones
  - Uniquement testé sur les dernières versions de Firefox et Chromium
  - L'interface pourrait être complétée/améliorée (raccourcis clavier,
    plus d'informations dans le mode diaporama, ...)

