# Holiday Celebration App Design Scheme (Festivus)

## 1. App Overview & Core Value
*   **App Name:** Festivus (or RichYear Holiday Edition)
*   **Core Value:** A unified digital companion for major holidays (Christmas & Lunar New Year), bridging the gap between traditional celebration and modern digital interaction. It creates an immersive atmosphere through dynamic visuals and haptic feedback.
*   **Target Audience:** Global users celebrating Christmas and/or Lunar New Year who want to share wishes and engage in light creative activities.

## 2. Functional Architecture
### Core Modules
1.  **Celebration Hub (Home)**
    *   **Dynamic Theme Engine:** Automatically or manually switches between Christmas (Snow/Green/Red) and New Year (Lanterns/Gold/Red) themes.
    *   **Immersive Background:** Particle systems (Snowfall vs. Rising Lanterns) powered by Skia.
    *   **Countdown Timer:** builds anticipation.
    *   **Daily Surprise:** Gamified interaction to reveal daily quotes or virtual gifts.

2.  **Wishes (Social/Greetings)**
    *   **Animated Cards:** High-quality visual cards with fluid swipe interactions.
    *   **Haptic "Shake":** Uses device sensors to simulate physical interactions (shaking a snow globe or firecrackers) to trigger sending wishes.

3.  **Decorate (DIY/Creative)**
    *   **Interactive Canvas:** Users can drag and drop holiday stickers onto a scene.
    *   **Gesture Control:** Natural touch gestures (drag, maybe pinch/zoom in future) for sticker placement.

## 3. Interaction Design Details
*   **Navigation:** A simplified Tab bar navigation allows quick access to all modes.
*   **Visuals:**
    *   **Colors:** Deep Red/Gold for CNY to evoke prosperity; Warm Red/Green/White for Christmas to evoke coziness.
    *   **Motion:** All transitions are animated using `react-native-reanimated`. The "Switch Holiday" toggle performs a playful bounce and color shift.
*   **Haptics:** Critical for "Top UX".
    *   Tapping tabs -> Light impact.
    *   Sending a wish -> Success notification pattern.
    *   Dropping a sticker -> Light impact.
    *   Switching themes -> Medium impact.

## 4. Technical Implementation
*   **Framework:** Expo Router (File-based routing).
*   **State Management:** React Context (`HolidayThemeContext`) for global theme state.
*   **Graphics:** `@shopify/react-native-skia` for high-performance particle animations (60fps+).
*   **Animations:** `react-native-reanimated` for layout transitions and shared element transitions.
*   **Gestures:** `react-native-gesture-handler` for the DIY drag-and-drop mechanics.

## 5. Innovation Points
*   **Dual-Cultural Design:** Seamlessly supports two major world cultures in one app without feeling disjointed.
*   **Sensory Feedback:** Heavily relies on Haptics to make digital actions feel physical.
*   **Performance:** Uses Skia for background effects which is far more performant than JS-based animations for particles.
