# Espace Parental - Suivi des Progrès des Enfants

[![React Native](https://img.shields.io/badge/React%20Native-0.7x.x-blue?logo=react)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-SDK-orange?logo=firebase)](https://firebase.google.com/docs/reference/js)
[![TypeScript](https://img.shields.io/badge/TypeScript-^4.x-blue?logo=typescript)](https://www.typescriptlang.org/)

Application mobile développée avec React Native (CLI) et Firebase pour permettre aux parents de suivre les progrès et activités de leurs enfants.

## Table des Matières

- [Fonctionnalités Clés](#fonctionnalités-clés)
- [Aperçu de la Structure du Projet](#aperçu-de-la-structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Configuration Firebase](#configuration-firebase)
- [Installation du Projet](#installation-du-projet)
- [Lancement de l'Application](#lancement-de-lapplication)
  - [Android](#android)
  - [iOS](#ios)
- [Scripts Disponibles](#scripts-disponibles)
- [Contribuer](#contribuer)
- [Auteur](#auteur)

## Fonctionnalités Clés (Exemples)

*   Authentification des parents (Email/Mot de passe, Google, etc. via Firebase Auth).
*   Gestion des profils enfants.
*   Enregistrement et visualisation des progrès (scolaires, activités, etc.).
*   Notifications en temps réel (via Firebase Cloud Messaging/Firestore).
*   Interface intuitive et conviviale.

*(Adaptez cette liste à vos fonctionnalités réelles)*

## Aperçu de la Structure du Projet

```bash
ESPACEPARENTAL/
├── tests/ # Tests unitaires et d'intégration
├── .bundle/ # Fichiers de build (généralement ignorés par Git)
├── android/ # Code natif Android et configuration Gradle
├── ios/ # Code natif iOS, projet Xcode et Pods
├── node_modules/ # Dépendances du projet
├── src/ # Code source de l'application
│ ├── config/ # Fichiers de configuration (ex: Firebase, APIs)
│ ├── screens/ # Écrans de l'application
│ │ ├── Home.tsx
│ │ └── Login.tsx
│ │ └── ... (autres écrans)
│ ├── types/ # Définitions TypeScript (interfaces, types)
│ │ ├── parent.ts
│ │ ├── student.ts
│ │ └── user.ts
│ │ └── ... (autres types)
│ ├── components/ # (Optionnel) Composants réutilisables
│ ├── navigation/ # (Optionnel) Configuration de la navigation
│ ├── services/ # (Optionnel) Logique métier, appels API Firebase
│ └── assets/ # (Optionnel) Images, polices, etc.
├── .eslintrc.js # Configuration ESLint
├── .gitignore # Fichiers et dossiers ignorés par Git
├── .prettierrc.js # Configuration Prettier
├── .watchmanconfig # Configuration Watchman
├── App.tsx # Composant racine de l'application
├── app.json # Configuration de l'application (nom, icône, etc.)
├── babel.config.js # Configuration Babel
├── Gemfile # Dépendances Ruby (pour Cocoapods sur iOS)
├── index.js # Point d'entrée de l'application React Native
├── jest.config.js # Configuration Jest (framework de test)
├── metro.config.js # Configuration Metro Bundler
├── package-lock.json # Versions exactes des dépendances (généré par npm)
├── package.json # Métadonnées du projet et dépendances
├── README.md # Ce fichier
└── tsconfig.json # Configuration TypeScript
```


## Technologies Utilisées

*   **React Native (CLI)**: Framework pour le développement d'applications mobiles multiplateformes.
*   **TypeScript**: Superset de JavaScript ajoutant un typage statique.
*   **Firebase**: Plateforme de développement d'applications de Google.
    *   `@react-native-firebase/app`: Module de base.
    *   `@react-native-firebase/auth`: Pour l'authentification.
    *   `@react-native-firebase/database`: Pour la base de données NoSQL en temps réel.
    *   *(Ajoutez d'autres modules Firebase que vous utilisez, ex: `@react-native-firebase/storage`, `@react-native-firebase/messaging`)*
*   **React Navigation** (Probablement): Pour la gestion de la navigation entre les écrans.
*   **ESLint & Prettier**: Pour le linting et le formatage du code.

## Prérequis

Avant de commencer, assurez-vous d'avoir configuré votre environnement de développement React Native CLI. Cela inclut typiquement :
*   [Node.js](https://nodejs.org/) (version 16 ou supérieure recommandée)
*   [Yarn](https://yarnpkg.com/) (recommandé) ou npm
*   [Watchman](https://facebook.github.io/watchman/) (recommandé pour macOS et Linux)
*   [JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) (version 11 ou 17 recommandée pour Android)
*   [Android Studio](https://developer.android.com/studio) (pour le développement Android)
    *   SDK Android et émulateur configuré
    *   Variables d'environnement `ANDROID_HOME` (ou `ANDROID_SDK_ROOT`) configurées.
*   [Xcode](https://developer.apple.com/xcode/) (pour le développement iOS - macOS requis)
    *   Outils de ligne de commande Xcode
    *   [CocoaPods](https://cocoapods.org/)
*   Un compte [Firebase](https://firebase.google.com/).

**Suivez impérativement le guide officiel de [configuration de l'environnement React Native CLI](https://reactnative.dev/docs/environment-setup) en sélectionnant "React Native CLI Quickstart".**

## Configuration Firebase

Avant d'installer les dépendances du projet, vous devez configurer Firebase :

1.  Créez un nouveau projet sur la [console Firebase](https://console.firebase.google.com/).
2.  **Pour Android**:
    *   Ajoutez une application Android à votre projet Firebase.
    *   Utilisez `com.espaceparental` (ou le nom de package défini dans `android/app/build.gradle` sous `applicationId`) comme nom de package Android.
    *   Téléchargez le fichier `google-services.json`.
    *   Placez ce fichier `google-services.json` à la racine du module d'application Android : `android/app/google-services.json`.
    *   Assurez-vous que le plugin Google Services est configuré dans vos fichiers Gradle :
        *   Dans `android/build.gradle` :
            ```gradle
            buildscript {
                // ...
                dependencies {
                    // ...
                    classpath 'com.google.gms:google-services:4.3.15' // ou la dernière version
                }
            }
            ```
        *   Dans `android/app/build.gradle` :
            ```gradle
            apply plugin: 'com.android.application'
            apply plugin: 'com.google.gms.google-services' // Ajoutez cette ligne à la fin du fichier
            ```
3.  **Pour iOS**:
    *   Ajoutez une application iOS à votre projet Firebase.
    *   Utilisez `com.espaceparental` (ou l'identifiant de bundle que vous avez défini dans Xcode) comme identifiant de bundle iOS.
    *   Téléchargez le fichier `GoogleService-Info.plist`.
    *   Ouvrez votre projet iOS dans Xcode (`ios/ESPACEPARENTAL.xcworkspace`).
    *   Faites glisser `GoogleService-Info.plist` dans le dossier principal de votre projet Xcode (souvent le dossier portant le nom de votre projet, assurez-vous que "Copy items if needed" est coché).
    *   Assurez-vous d'avoir ajouté le code d'initialisation Firebase à votre `ios/ESPACEPARENTAL/AppDelegate.mm` (ou `AppDelegate.m`):
        ```objectivec
        #import <Firebase.h> // Ajoutez cette ligne en haut

        @implementation AppDelegate

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
        {
          // ... (code existant)
          if ([FIRApp defaultApp] == nil) {
            [FIRApp configure];
          }
          // ... (code existant)
          return YES;
        }
        // ...
        @end
        ```
4.  Activez les services Firebase dont vous avez besoin (par exemple, Authentication, Firestore Database, Storage, etc.) dans la console Firebase.
5.  (Optionnel mais recommandé) Configurez les règles de sécurité pour Firestore/Realtime Database et Storage.

Consultez la documentation de [@react-native-firebase](https://rnfirebase.io/docs/v5.x.x/installation/initial-setup) (adaptez la version si besoin) pour des instructions détaillées sur l'intégration.

## Installation du Projet

Une fois votre environnement et Firebase configurés :

1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/yassinekamouss/EspaceParental.git
    cd EspaceParental
    ```

2.  Installez les dépendances JavaScript :
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Pour iOS uniquement**, installez les dépendances natives (Pods) :
    ```bash
    cd ios
    pod install
    cd ..
    ```
    *Note : Si vous rencontrez des problèmes avec `pod install`, essayez `arch -x86_64 pod install` sur les Mac M1/M2.*

## Lancement de l'Application

Assurez-vous d'avoir un émulateur en cours d'exécution ou un appareil physique connecté et correctement configuré pour le débogage.

### Android

```bash
npx react-native run-android
```

### IOS
```bash
npx react-native run-ios
```

## Scripts Disponibles
Dans le package.json, vous trouverez probablement les scripts suivants (adaptez si nécessaire) :
npm start ou yarn start: Démarre Metro Bundler.
npm test ou yarn test: Lance les tests avec Jest.
npm run lint ou yarn lint: Vérifie le code avec ESLint.

## Contribuer
1. Forkez le projet sur GitHub (cela se fait via l'interface GitHub, pas en ligne de commande)

2. Clonez votre fork localement
```bash
git clone https://github.com/yassinekamouss/EspaceParental.git
cd EspaceParental
```
3. Créez une nouvelle branche
```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

4. Effectuez vos modifications, puis committez-les
```bash
git add .
git commit -m "Ajout de ma nouvelle fonctionnalité"
```
5. Poussez votre branche vers votre dépôt distant (fork)
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```
## Auteur
[@yassinekamouss](mailto:yassinekamouss76@gmail.com)