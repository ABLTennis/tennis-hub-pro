# Fix Git Push Permission Error

## Problem
You're authenticated as `Einzelgaanger` but trying to push to `ABLTennis/tennis-hub-pro` repository.

Error: `Permission to ABLTennis/tennis-hub-pro.git denied to Einzelgaanger`

---

## Solutions

### Solution 1: Use Personal Access Token (Recommended)

1. **Create a GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "Tennis Hub Pro"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Update Git Remote to Use Token:**
   ```powershell
   git remote set-url origin https://YOUR_TOKEN@github.com/ABLTennis/tennis-hub-pro.git
   ```
   Replace `YOUR_TOKEN` with your actual token.

3. **Or use your username with token:**
   ```powershell
   git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/ABLTennis/tennis-hub-pro.git
   ```

4. **Try pushing again:**
   ```powershell
   git push origin main
   ```

---

### Solution 2: Use SSH Instead of HTTPS

1. **Check if you have SSH keys:**
   ```powershell
   ls ~/.ssh
   ```

2. **Generate SSH key (if you don't have one):**
   ```powershell
   ssh-keygen -t ed25519 -C "tennis.abl.ug@gmail.com"
   ```
   - Press Enter to accept default location
   - Press Enter for no passphrase (or set one)

3. **Add SSH key to GitHub:**
   - Copy your public key:
     ```powershell
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

4. **Change remote to SSH:**
   ```powershell
   git remote set-url origin git@github.com:ABLTennis/tennis-hub-pro.git
   ```

5. **Test SSH connection:**
   ```powershell
   ssh -T git@github.com
   ```

6. **Try pushing:**
   ```powershell
   git push origin main
   ```

---

### Solution 3: Use GitHub CLI

1. **Install GitHub CLI:**
   - Download from: https://cli.github.com/

2. **Authenticate:**
   ```powershell
   gh auth login
   ```
   - Select GitHub.com
   - Select HTTPS or SSH
   - Follow prompts

3. **Try pushing:**
   ```powershell
   git push origin main
   ```

---

### Solution 4: Check Organization Access

If you have access to the ABLTennis organization but it's still not working:

1. **Verify your account has access:**
   - Go to: https://github.com/orgs/ABLTennis/people
   - Make sure your account is listed

2. **If you need to be added:**
   - Ask an organization owner to add you
   - You need at least "Write" permission

3. **Update your Git credentials:**
   ```powershell
   git config --global credential.helper manager-core
   ```
   Then try pushing - Windows will prompt for credentials

---

## Quick Fix (Windows Credential Manager)

1. **Clear old credentials:**
   ```powershell
   git credential-manager-core erase
   ```
   Then enter:
   ```
   host=github.com
   protocol=https
   ```

2. **Or use Windows Credential Manager:**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Go to "Windows Credentials"
   - Find any GitHub entries
   - Remove them

3. **Try pushing again:**
   ```powershell
   git push origin main
   ```
   Windows will prompt for credentials - use a token or correct account

---

## Recommended: Use Personal Access Token

**Step-by-step:**

1. Create token: https://github.com/settings/tokens/new
   - Name: "Tennis Hub Pro"
   - Expiration: 90 days (or No expiration for local dev)
   - Scopes: Check `repo`
   - Generate token

2. Copy the token (starts with `ghp_...`)

3. Update remote:
   ```powershell
   git remote set-url origin https://ghp_YOUR_TOKEN_HERE@github.com/ABLTennis/tennis-hub-pro.git
   ```

4. Push:
   ```powershell
   git push origin main
   ```

**Note:** The token will be saved in the remote URL. For better security, consider using Git Credential Manager or SSH.

---

## Verify Your Setup

```powershell
# Check remote URL
git remote -v

# Check your Git config
git config user.name
git config user.email
```

---

**If you need help, let me know which solution you want to use!**
