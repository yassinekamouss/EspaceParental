import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  // Animation values persistantes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
    } catch (error: any) {
      let message = '';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Aucun utilisateur trouvé avec cet email.';
          break;
        case 'auth/wrong-password':
          message = 'Mot de passe incorrect.';
          break;
        case 'auth/invalid-email':
          message = 'Email invalide.';
          break;
        default:
          message = error.message;
      }
      Alert.alert('Erreur de connexion', message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      Alert.alert(
        'Email requis',
        'Veuillez entrer votre email pour réinitialiser votre mot de passe',
      );
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Email envoyé',
        'Consultez votre boîte mail pour réinitialiser votre mot de passe',
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3464A3" barStyle="light-content" />
      {/* Background Elements */}
      <View style={styles.topBackground} />
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        {/* Header Section */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={styles.logoContainer}>
            <Icon name="school" size={45} color="#FFF" />
          </View>
          <Text style={styles.title}>Espace Parental</Text>
          <Text style={styles.subtitle}>
            Suivez les progrès en mathématiques de votre enfant
          </Text>
        </Animated.View>

        {/* Form Section */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.formHeader}>
            <Icon name="lock-check" size={28} color="#3464A3" />
            <Text style={styles.formTitle}>Connexion</Text>
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="email-outline"
              size={22}
              color="#3464A3"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={22}
              color="#3464A3"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Mot de passe"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
            <TouchableOpacity
              onPress={() => setSecure(!secure)}
              style={styles.eyeIcon}>
              <Icon
                name={secure ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#a0a0a0"
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3464A3" />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={login}
                activeOpacity={0.8}>
                <Text style={styles.loginButtonText}>Se connecter</Text>
                <Icon name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetPassword}
                style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Mot de passe oublié?</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.mathElements}>
            <Text style={styles.plusSymbol}>+</Text>
            <Text style={styles.minusSymbol}>−</Text>
            <Text style={styles.multiplySymbol}>×</Text>
            <Text style={styles.divideSymbol}>÷</Text>
            <Text style={styles.equalsSymbol}>=</Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#3464A3',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  circle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 60,
    left: -20,
  },
  circle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: 140,
    right: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4F81C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2ECFA',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    width: width - 40,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 55,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 12,
  },
  loadingContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    height: 55,
    backgroundColor: '#3464A3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#154c79',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resetButton: {
    alignItems: 'center',
    padding: 5,
    marginTop: 5,
  },
  resetButtonText: {
    color: '#3464A3',
    fontSize: 15,
  },
  mathElements: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 80,
    height: 80,
    backgroundColor: '#FFD166',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{rotate: '15deg'}],
  },
  plusSymbol: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    top: 15,
    left: 25,
  },
  minusSymbol: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    bottom: 15,
    left: 25,
  },
  multiplySymbol: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    top: 40,
    left: 15,
  },
  divideSymbol: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    top: 40,
    right: 15,
  },
  equalsSymbol: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    top: 30,
    right: 30,
  },
});
