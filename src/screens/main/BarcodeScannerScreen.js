import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
/**
 * BarcodeScannerScreen component for scanning barcodes and fetching product data from Open Food Facts API.
 * 
 * This screen uses the device's camera to scan barcodes. Upon successful scan, it attempts to fetch
 * product information from the Open Food Facts API. If the product is found, it navigates to the AddFood
 * screen with prefilled data. If not found, it offers to manually register the product.
 * 
 * Features:
 * - Requests camera permissions if not granted.
 * - Prevents multiple scans by setting a scanned state.
 * - Handles API errors and provides user feedback via alerts.
 * - Allows rescanning after processing.
 * 
 * @component
 * @example
 * // Usage in navigation
 * <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
 */
export default function BarcodeScannerScreen() {
  // Estado para armazenar o dado do código lido e evitar múltiplas leituras
  const [scanned, setScanned] = useState(false);
  // Hook do Expo para gerenciar permissões da câmera
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
 
  // 1. Tratamento da Permissão
  if (!permission) {
    // A permissão ainda está sendo carregada
    return <View />;
  }
 
  if (!permission.granted) {
    // Permissão não concedida, solicita ou exibe mensagem
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Pedir Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  // 2. Função acionada quando um código é escaneado
  const handleBarCodeScanned = async ({ type, data }) => {
    // Se 'scanned' for true, significa que já processamos um código, então ignoramos
    if (scanned) return;
 
    // Marca como lido para evitar múltiplas chamadas
    setScanned(true);

    try {
      // Buscar dados na Open Food Facts
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${data}.json`);
      const json = await res.json();
      if (json.status !== 1 || !json.product) {
        Alert.alert('Não encontrado', 'Produto não encontrado. Deseja registar manualmente?', [
          { text: 'Cancelar', onPress: () => setScanned(false), style: 'cancel' },
          { text: 'Registar', onPress: () => navigation.navigate('AddFood', { prefill: { name: '', calories: '', protein: '', carbs: '', fat: '', barcode: data } }) }
        ]);
        return;
      }

      const p = json.product;
      const nutrients = p.nutriments || {};
      const prefill = {
        name: p.product_name || p.brands || 'Produto',
        calories: Number(nutrients['energy-kcal_100g'] ?? nutrients['energy-kcal'] ?? 0),
        protein: Number(nutrients['proteins_100g'] ?? 0),
        carbs: Number(nutrients['carbohydrates_100g'] ?? 0),
        fat: Number(nutrients['fat_100g'] ?? 0),
      };

      navigation.navigate('AddFood', { prefill });
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao procurar o produto');
      setScanned(false);
    }
  };
 
  // 3. Renderiza o Scanner
  return (
    <View style={styles.container}>
      {/* O CameraView é o componente que exibe a câmera e faz a leitura */}
      <CameraView
        style={styles.camera}
        // Configura o scanner para todos os tipos (por padrão) ou específicos, como 'qr'
        // barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        // Callback para quando um código é detectado
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        // Se já leu um código, definimos 'scanned' como true, e o onBarcodeScanned fica 'undefined' ou vazio para parar de ler.
      >
        <View style={styles.overlay}>
          {scanned ? (
            <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanAgainButton}>
              <Text style={styles.scanAgainText}>Toque para Escanear Novamente</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.instructionText}>
              Aponte a câmera para um código de barras ou QR.
            </Text>
          )}
        </View>
      </CameraView>
    </View>
  );
}
 
// 4. Estilos (Opcional, para melhor visualização)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 30,
  },
  instructionText: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  scanAgainButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
  },
  scanAgainText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});