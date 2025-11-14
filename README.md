# Shopify Theme Development

This repository contains the theme for **Xactz Store**.  
The project follows a 3-branch Git workflow with **Shopify CLI integration** for syncing updates and managing development safely.

---


## 🌿 Branch Workflow

| Branch | Description |
|--------|--------------|
| **main** | Merge `main` into `dev` to update a new function. |
| **dev** | Used for development and feature work. Merge `dev` into `xactz-live` to stay synced with live store and custom feature. |
| **xactz-live** | Mirrors the client’s live store theme. Always kept up-to-date via `shopify theme pull`. |

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/AnD-code-developer/Xactz-store
```

### 2. Install Shopify CLI
If not installed:
```bash
npm install -g @shopify/cli @shopify/theme
```

### 3. Login to your Shopify store
```bash
shopify login --store <your-store-name.myshopify.com>
```

### 4. Pull the theme
```bash
For client’s live theme to xactz-live branch:
shopify theme pull --theme <theme-id>
```

## 🧩 Development Workflow

### 1. Create a new feature
```bash
git checkout dev
git pull origin dev
```
Create a new branch for your feature if needed
```bash
git checkout -b feature/new-section
```

### 2. Add and commit changes
```bash
git add .
git commit -m "Add new banner section"
git push origin dev
```

Sync client updates

When the client updates their live store:
```bash
git checkout xactz-live
shopify theme pull --theme <client-theme-id>
git add .
git commit -m "Update from client store"
git push
```
Merge updates into dev
```bash
git checkout dev
git merge xactz-live
```

## 🚀 Deploy to Dev Store

To preview changes on your dev store:
```bash
shopify login --store <your-dev-store.myshopify.com>
shopify theme push --theme <dev-theme-id>
```
