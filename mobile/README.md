# Recipe App Mobile

React Native mobile application built with Expo.

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API Connection

**IMPORTANT:** You need to update the API URL with your computer's IP address.

#### Find Your IP Address:

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network connection (e.g., `192.168.1.100`)

#### Update API Configuration:

Open `src/config/api.js` and replace the IP address:

```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';
// Example: 'http://192.168.1.100:5000/api'
```

**Note:**
- Use your actual IP address, not `localhost` or `127.0.0.1`
- Your iOS device and computer must be on the same WiFi network
- Make sure your firewall allows connections on port 5000

### 3. Start the Development Server

```bash
npm start
```

This will:
- Start the Expo development server
- Show a QR code in the terminal
- Open Expo DevTools in your browser

### 4. Run on Your iOS Device

#### Install Expo Go:
1. Open App Store on your iPhone
2. Search for "Expo Go"
3. Install the app

#### Connect to Your App:
1. Open Expo Go app
2. Tap "Scan QR code"
3. Scan the QR code from your terminal
4. Wait for the app to load (first time may take a minute)

**Alternative:** If QR code doesn't work:
- Make sure your phone and computer are on the same WiFi
- In Expo Go, tap "Enter URL manually"
- Type the URL shown in terminal (e.g., `exp://192.168.1.100:8081`)

## App Features

### Authentication
- **Register:** Create a new account with name, email, and password
- **Login:** Sign in with your credentials
- **Auto-login:** Stay logged in between sessions

### Home Screen
- View all available recipes
- Search recipes by name
- Pull to refresh recipe list
- Logout option

### Recipe Details
- Enter number of persons/servings
- Calculate required ingredients
- Edit ingredient quantities
- Auto-recalculation of all ingredients when one is modified

### Request New Dish
- Submit requests for dishes not in the app
- Add optional description
- Email notification sent to admin

## Testing the App

### 1. Register a New Account
- Open the app
- Tap "Don't have an account? Register"
- Fill in your details
- Tap "Register"

### 2. Browse Recipes
- You'll see the home screen with recipe cards
- Search for specific recipes
- Tap on any recipe to view details

### 3. Calculate Ingredients
- Open a recipe
- Enter number of persons (e.g., 6)
- Tap "Calculate"
- See the adjusted ingredient quantities

### 4. Edit Ingredients
- After calculating, tap on any ingredient quantity
- Change the value
- Watch other ingredients adjust automatically

### 5. Request a Dish
- Tap the "Request Dish" button (bottom right)
- Enter dish name and description
- Submit request

## Troubleshooting

### "Network Error" or "Failed to fetch"
**Solution:**
1. Verify backend server is running (`npm run dev` in backend folder)
2. Check API_BASE_URL in `src/config/api.js` has correct IP
3. Ensure phone and computer are on same WiFi
4. Try accessing `http://YOUR_IP:5000/api/health` in phone's browser

### App Won't Load on Device
**Solution:**
1. Restart Expo development server
2. Close and reopen Expo Go app
3. Check if firewall is blocking connections
4. Try using tunnel mode: `npm start -- --tunnel`

### "Unable to connect to MongoDB"
**Solution:**
- Backend server needs to be running first
- Check MongoDB Atlas connection in backend

### Slow Performance
**Solution:**
- First load is always slower
- Enable "Fast Refresh" in Expo Go settings
- Use development mode for faster reload

## Development Tips

### Hot Reload
- Changes to code will automatically reload in the app
- Shake your device to open developer menu
- Use "Reload" if something doesn't update

### Debugging
- Shake device → "Debug Remote JS"
- Opens Chrome DevTools for debugging
- View console logs and errors

### Testing on Multiple Devices
- Multiple devices can connect to same development server
- Each device scans the same QR code

## Project Structure

```
mobile/
├── src/
│   ├── config/
│   │   └── api.js           # API configuration
│   ├── context/
│   │   └── AuthContext.js   # Authentication context
│   └── screens/
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── HomeScreen.js
│       ├── RecipeDetailScreen.js
│       └── RequestDishScreen.js
├── App.js                   # Main app component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── babel.config.js          # Babel configuration
```

## Building for Production

### iOS (Requires Mac and Apple Developer Account)
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform ios
```

## Common Commands

```bash
# Start development server
npm start

# Start with tunnel (if local network doesn't work)
npm start -- --tunnel

# Clear cache and restart
npm start -- --clear

# Run on iOS simulator (Mac only)
npm run ios

# Check for issues
expo doctor
```

## Next Steps

1. Customize the app theme in `App.js`
2. Add more recipes via backend seed script
3. Implement user profile screen
4. Add recipe images
5. Enable offline mode with AsyncStorage

## Support

If you encounter issues:
1. Check that backend is running
2. Verify IP address in api.js
3. Ensure both devices on same network
4. Check Expo Go app is up to date
5. Try restarting both servers

Happy cooking! 🍳


