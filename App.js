// // App.js
// import React, { useEffect } from 'react';
// import { SafeAreaView, StyleSheet, LogBox, Platform, AppState } from 'react-native';
// import GestureRecognitionScreen from './src/screens/GestureRecognitionScreen';
// import BottomTabs from './src/BottomTabs';

// // Ignore specific warnings that don't affect functionality
// LogBox.ignoreLogs([
//   'Require cycle:', // Ignore require cycles
//   'ViewPropTypes will be removed', // Ignore deprecation warnings
// ]);

// // Main app with optimized lifecycle management
// export default function App() {
//   // Handle app state changes to optimize resource usage
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (nextAppState.match(/inactive|background/)) {
//         // App going to background - release resources
//         console.log('App entering background - releasing resources');
//       } else if (nextAppState === 'active') {
//         // App coming to foreground - reinitialize if needed
//         console.log('App entering foreground - reinitializing');
//       }
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <BottomTabs />
//       <GestureRecognitionScreen />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
// });
import React from 'react';
import BottomTabs from './src/BottomTabs';

const App = () => {
  return <BottomTabs />;
};

export default App;

