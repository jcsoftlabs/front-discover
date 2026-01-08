# 📖 Manuel Opérationnel
## Système de Tourisme - Ministère du Tourisme d'Haïti

**Version:** 1.0  
**Date:** Janvier 2026

---

## 📋 Table des Matières

1. [Connexion au Système](#1-connexion-au-système)
2. [Tableau de Bord Admin](#2-tableau-de-bord-admin)
3. [Gestion Quotidienne](#3-gestion-quotidienne)
4. [Création de Contenu](#4-création-de-contenu)
5. [Validation des Partenaires](#5-validation-des-partenaires)
6. [Modération des Avis](#6-modération-des-avis)
7. [Promotions et Événements](#7-promotions-et-événements)
8. [Rapports et Statistiques](#8-rapports-et-statistiques)

---

## 1. Connexion au Système

### Accéder au Portail Admin

1. Ouvrez votre navigateur
2. Accédez à : **https://votre-domaine.com/admin/login**
3. Entrez vos identifiants :
   - **Email :** votre-email@ministere.ht
   - **Mot de passe :** votre mot de passe

### Menu Principal

Après connexion, vous verrez le menu :

| Menu | Description |
|------|-------------|
| 🏠 **Accueil** | Vue d'ensemble et statistiques |
| 👥 **Utilisateurs** | Gestion des comptes utilisateurs |
| 🤝 **Partenaires** | Validation et gestion partenaires |
| 🏨 **Établissements** | Hôtels, restaurants, etc. |
| 🗺️ **Sites** | Sites touristiques |
| 📅 **Événements** | Concerts, festivals, etc. |
| ⭐ **Avis** | Modération des avis |
| 📊 **Statistiques** | Rapports et analytics |

---

## 2. Tableau de Bord Admin

### Vue d'ensemble

Le tableau de bord affiche :

- **📈 Statistiques clés**
  - Nombre d'utilisateurs inscrits
  - Nombre d'établissements actifs
  - Nombre de sites touristiques
  - Événements à venir

- **🔔 Alertes**
  - Partenaires en attente de validation
  - Avis en attente de modération
  - Nouvelles inscriptions

- **📊 Graphiques**
  - Inscriptions par mois
  - Consultations par catégorie

---

## 3. Gestion Quotidienne

### Tâches Quotidiennes Recommandées

| Priorité | Tâche | Action |
|----------|-------|--------|
| 🔴 Haute | Modérer les avis | Administration → Avis |
| 🔴 Haute | Valider les partenaires | Administration → Partenaires |
| 🟡 Moyenne | Vérifier les statistiques | Administration → Statistiques |
| 🟢 Basse | Mettre à jour les événements | Administration → Événements |

### Workflow Type

```
09h00 - Connexion et consultation des alertes
09h30 - Modération des nouveaux avis
10h00 - Validation des demandes partenaires
11h00 - Mise à jour des établissements/événements
16h00 - Consultation des statistiques du jour
```

---

## 4. Création de Contenu

### Ajouter un Établissement

1. **Administration → Établissements → + Nouveau**

2. **Informations de base** (obligatoires) :
   - Nom de l'établissement
   - Type (Hôtel, Restaurant, etc.)
   - Adresse complète
   - Ville et Département

3. **Informations complémentaires** :
   - Description détaillée
   - Prix indicatif
   - Téléphone et email
   - Site web

4. **Images** :
   - Cliquez sur "Ajouter des images"
   - Sélectionnez jusqu'à 10 images
   - L'image principale sera affichée en premier

5. **Localisation** :
   - Entrez les coordonnées GPS
   - Ou cliquez sur la carte pour positionner

6. **Cliquez sur "Enregistrer"**

### Ajouter un Site Touristique

1. **Administration → Sites → + Nouveau**

2. Remplissez :
   - Nom du site
   - Catégorie (Monument, Plage, Parc, etc.)
   - Description
   - **Coordonnées GPS** (obligatoires)
   - Prix d'entrée (si applicable)
   - Horaires d'ouverture

3. **Enregistrer**

---

## 5. Validation des Partenaires

### Processus de Validation

1. **Administration → Partenaires**
2. Filtrez par **"En attente"**
3. Cliquez sur le nom du partenaire

### Vérifications à effectuer

| Élément | Vérification |
|---------|--------------|
| **Identité** | Le nom correspond à une entreprise réelle |
| **Email** | Email professionnel valide |
| **Téléphone** | Numéro haïtien valide |
| **Description** | Description cohérente de l'activité |

### Actions

- ✅ **Approuver** - Le partenaire peut maintenant ajouter ses établissements
- ❌ **Rejeter** - Ajoutez une raison du rejet
- ⏸️ **Suspendre** - Bloquer temporairement un partenaire approuvé

---

## 6. Modération des Avis

### Consulter les Avis en Attente

1. **Administration → Avis**
2. Sélectionnez le filtre **"En attente"**

### Critères d'Approbation

| ✅ Approuver si | ❌ Rejeter si |
|-----------------|--------------|
| Commentaire constructif | Langage offensant |
| Note justifiée | Spam ou publicité |
| Contenu original | Fausses informations |
| Concerne l'établissement | Hors sujet |

### Procédure de Modération

1. Lisez le commentaire complet
2. Vérifiez la note (1-5 étoiles)
3. Décidez :
   - **Approuver** → L'avis sera visible
   - **Rejeter** → Ajoutez une note explicative

> ⚠️ **Important :** Ne rejetez pas un avis négatif simplement parce qu'il est négatif. Les critiques constructives sont acceptables.

---

## 7. Promotions et Événements

### Créer une Promotion

1. **Administration → Établissements → [Sélectionner]**
2. Onglet **"Promotions"**
3. **+ Nouvelle Promotion**
4. Remplissez :
   - Titre de la promotion
   - Description
   - Pourcentage de réduction
   - Date de début et fin

### Créer un Événement

1. **Administration → Événements → + Nouveau**
2. Informations requises :
   - **Titre** : Nom de l'événement
   - **Dates** : Début et fin
   - **Lieu** : Adresse ou nom du lieu
   - **Catégorie** : Concert, Festival, etc.
3. Informations optionnelles :
   - Capacité maximale
   - Prix d'entrée
   - Images et affiches
4. **Enregistrer**

### Événements Récurrents (Carnaval, etc.)

Pour les événements annuels :
1. Créez l'événement chaque année
2. Mettez à jour les dates
3. Conservez la même description de base

---

## 8. Rapports et Statistiques

### Accéder aux Statistiques

**Administration → Statistiques**

### Rapports Disponibles

| Rapport | Contenu |
|---------|---------|
| **Affluence** | Visiteurs par jour/semaine/mois |
| **Géographie** | Origine des visiteurs |
| **Popularité** | Établissements les plus consultés |
| **Avis** | Évolution des notes moyennes |
| **Partenaires** | Activité des partenaires |

### Exporter les Données

1. Sélectionnez le rapport souhaité
2. Choisissez la période
3. Cliquez sur **"Exporter"**
4. Format : CSV ou PDF

### Indicateurs Clés à Surveiller

| Indicateur | Objectif | Alerte si |
|------------|----------|-----------|
| Visiteurs/jour | > 100 | < 50 |
| Note moyenne | > 4.0 | < 3.5 |
| Temps de validation | < 24h | > 48h |
| Avis modérés/jour | 100% | < 80% |

---

## 📞 Support

**Questions opérationnelles :**
- Consultez ce manuel
- Contactez le superviseur

**Problèmes techniques :**
- Consultez TROUBLESHOOTING.md
- Contactez l'équipe IT

---

*Document généré le 8 janvier 2026*
