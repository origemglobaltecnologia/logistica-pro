import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function AlocacaoPage() {
  const [aba, setAba] = useState('dashboard');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: '', codigo: '', altura: '7', largura: '10', comprimento: '1', quantidade: '863', desconto: '1' });
  const [itemVisualizado, setItemVisualizado] = useState<any>(null);

      const API = 'http://100.111.96.79:8083/api/alocacoes';


  const carregar = async () => { const res = await fetch(API); setData(await res.json()); };

  const calcularComprimento = (a: number, l: number, t: number, d: number) => {
    const alturaEfetiva = Math.max(0, a - d);
    const espacoPorFila = alturaEfetiva * l;
    if (espacoPorFila <= 0) return "0";
    let contador = 0;
    let totalAcumulado = 0;
    while (totalAcumulado < t && contador < 1000) {
      contador++;
      totalAcumulado += espacoPorFila;
    }
    return contador.toString();
  };

  const handleChange = (key: string, value: string) => {
    const temp = { ...formData, [key]: value };
    const a = parseFloat(temp.altura) || 0;
    const l = parseFloat(temp.largura) || 0;
    const t = parseFloat(temp.quantidade) || 0;
    const d = parseFloat(temp.desconto) || 0;
    setFormData({ ...temp, comprimento: calcularComprimento(a, l, t, d) });
  };

  const salvar = async () => {
    const isEdit = formData.id !== '';
    await fetch(isEdit ? `${API}/${formData.id}` : API, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: formData.codigo, altura: parseFloat(formData.altura), largura: parseFloat(formData.largura), comprimento: parseFloat(formData.comprimento), quantidade: parseInt(formData.quantidade) })
    });
    setAba('lista'); carregar();
  };

  const deletar = async (id: number) => { await fetch(`${API}/${id}`, { method: 'DELETE' }); setAba('lista'); carregar(); };

  useEffect(() => { carregar(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerText}>LOGÍSTICA PRO</Text></View>
      <ScrollView contentContainerStyle={styles.content}>
        {aba === 'dashboard' && (
          <View style={styles.card}>
            <Text style={styles.title}>Dashboard</Text>
            <TouchableOpacity style={styles.btnBig} onPress={() => { setFormData({id: '', codigo: '', altura: '7', largura: '10', comprimento: '1', quantidade: '863', desconto: '1'}); setAba('form'); }}><Text style={styles.btnText}>NOVA ALOCAÇÃO</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btnBig, {backgroundColor: '#6c757d'}]} onPress={() => setAba('lista')}><Text style={styles.btnText}>LISTAR TODAS</Text></TouchableOpacity>
          </View>
        )}

        {aba === 'form' && (
          <View style={styles.card}>
            <Text style={styles.title}>Dados da Alocação</Text>
            <TextInput style={styles.input} placeholder="Código" value={formData.codigo} onChangeText={(t) => handleChange('codigo', t)} />
            <TextInput style={styles.input} placeholder="Altura" keyboardType="numeric" value={formData.altura} onChangeText={(t) => handleChange('altura', t)} />
            <TextInput style={styles.input} placeholder="Largura" keyboardType="numeric" value={formData.largura} onChangeText={(t) => handleChange('largura', t)} />
            <TextInput style={styles.input} placeholder="Quantidade" keyboardType="numeric" value={formData.quantidade} onChangeText={(t) => handleChange('quantidade', t)} />
            <TextInput style={styles.input} placeholder="Desconto (Amarração)" keyboardType="numeric" value={formData.desconto} onChangeText={(t) => handleChange('desconto', t)} />
            <Text style={styles.labelHighlight}>Comprimento Necessário: {formData.comprimento}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btnSmall, {backgroundColor: '#28a745'}]} onPress={salvar}><Text style={styles.btnText}>SALVAR</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btnSmall, {backgroundColor: '#dc3545'}]} onPress={() => setAba('lista')}><Text style={styles.btnText}>CANCELAR</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {aba === 'lista' && (
          <View>
            <TouchableOpacity style={[styles.btnBig, {backgroundColor: '#6c757d'}]} onPress={() => setAba('dashboard')}><Text style={styles.btnText}>VOLTAR</Text></TouchableOpacity>
            <FlatList data={data} keyExtractor={(i: any) => i.id.toString()} renderItem={({ item }: any) => (
              <View style={styles.cardRow}>
                <Text style={styles.itemText}>{item.codigo}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.btnMini, {backgroundColor: '#007bff'}]} onPress={() => { setItemVisualizado(item); setAba('view'); }}><Text style={styles.btnText}>VER</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.btnMini, {backgroundColor: '#ffc107'}]} onPress={() => { setFormData({...item, altura: String(item.altura), largura: String(item.largura), comprimento: String(item.comprimento), quantidade: String(item.quantidade), desconto: '1'}); setAba('form'); }}><Text style={styles.btnText}>EDIT</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.btnMini, {backgroundColor: '#dc3545'}]} onPress={() => deletar(item.id)}><Text style={styles.btnText}>DEL</Text></TouchableOpacity>
                </View>
              </View>
            )}/>
          </View>
        )}

        {aba === 'view' && itemVisualizado && (
          <View style={styles.card}>
            <Text style={styles.title}>DETALHES DO ITEM</Text>
            <View style={styles.detailBox}>
                <Text style={styles.label}>Código</Text><Text style={styles.value}>{itemVisualizado.codigo}</Text>
                <Text style={styles.label}>Altura</Text><Text style={styles.value}>{itemVisualizado.altura}</Text>
                <Text style={styles.label}>Largura</Text><Text style={styles.value}>{itemVisualizado.largura}</Text>
                <Text style={styles.label}>Comprimento</Text><Text style={styles.valueHighlight}>{itemVisualizado.comprimento}</Text>
                <Text style={styles.label}>Quantidade</Text><Text style={styles.value}>{itemVisualizado.quantidade}</Text>
            </View>
            <TouchableOpacity style={[styles.btnBig, {backgroundColor: '#6c757d'}]} onPress={() => setAba('lista')}><Text style={styles.btnText}>VOLTAR</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9ecef' },
  header: { padding: 40, backgroundColor: '#007bff', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 20, marginBottom: 20, elevation: 8 },
  cardRow: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { fontSize: 18, borderBottomWidth: 2, borderColor: '#007bff', marginBottom: 20, padding: 15 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#444' },
  labelHighlight: { fontSize: 26, fontWeight: 'bold', color: '#007bff', marginBottom: 20 },
  value: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  valueHighlight: { fontSize: 32, fontWeight: 'bold', color: '#d9534f', marginBottom: 20 },
  detailBox: { borderLeftWidth: 5, borderLeftColor: '#007bff', paddingLeft: 15, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  btnBig: { backgroundColor: '#007bff', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  btnSmall: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center' },
  btnMini: { padding: 12, borderRadius: 8, alignItems: 'center', minWidth: 60 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  itemText: { fontSize: 22, fontWeight: 'bold' }
});
