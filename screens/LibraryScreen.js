import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { tracks } from '../mockData';
import { useAudio } from '../context/AudioContext';
import * as DocumentPicker from 'expo-document-picker'; //Importa a biblioteca que permite ao usuário selecionar as músicas
import { File, Paths } from 'expo-file-system'; // Nova API de arquivos do Expo 54
import { useDatabase } from '../context/DatabaseContext'; // Importa a biblioteca para acessar o banco de dados
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen() {

  const { playTrack } = useAudio();
  const db = useDatabase(); //Guarda o banco de dados dentro da variável db
  const [musicas, setMusicas] = useState([]); //Variável que vai guardar as músicas

  // Função que vai carregar as músicas do banco de dados para mostrar no app
  const carregarMusicas = async () => {
    try {
      // Pega todas as linhas da tabela no banco de dados
      const todasMusicas = await db.getAllAsync('SELECT * FROM trilhas');

      setMusicas(todasMusicas);
    }
    catch (error) {
      console.log('Houve um erro ao carregar músicas do banco de dados: ', error);
    }
  };

  //Faz a função rodar quando a tela abre
  useEffect(() => {
    carregarMusicas();
  }, []);

  // Função para remover a música do banco de dados
  const removerMusica = (id) => {
    Alert.alert(
      "Remover Música",
      "Tem certeza que deseja remover esta música da biblioteca?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Busca a URL da música para deletar o arquivo físico (limpar espaço)
              const musica = await db.getFirstAsync('SELECT url FROM trilhas WHERE id = ?', id);
              if (musica && musica.url) {
                try {
                  const arquivo = new File(musica.url);
                  if (arquivo.exists) {
                    arquivo.delete(); // Deleta o arquivo físico usando a nova API
                  }
                } catch (err) {
                  console.log('Erro ao deletar o arquivo físico:', err);
                }
              }

              // 2. Remove a música do banco de dados
              await db.runAsync('DELETE FROM trilhas WHERE id = ?', id);
              carregarMusicas(); // Recarrega a lista após remover
            } catch (error) {
              console.log('Erro ao remover música: ', error);
              Alert.alert("Erro", "Não foi possível remover a música.");
            }
          }
        }
      ]
    );
  };

  const pickFolder = async () => {
    try {
      //Pede permissão ao usuário, abrindo a tela de seleção de arquivos
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', //permite só arquivos de áudio
        multiple: true, //permite selecionar mais de um
        copyToCacheDirectory: true //Converte o content:// para file:// para que a API nova consiga acessar
      });

      //Se o usuário não cancelou a operação
      if (!result.canceled) {
        //Lista as músicas selecioadas e guarda numa variável
        const audioFiles = result.assets;

        for (const file of audioFiles) { //Percorre as músicas que o usuário selecionou

          // Cria um id aleatório para a música
          const uniqueId = 'trilha_' + Date.now() + Math.floor(Math.random() * 1000);

          // Usa a nova API de arquivos do Expo 54 com um nome único para não dar erro se já existir
          const arquivoTemporario = new File(file.uri);
          const arquivoPermanente = new File(Paths.document, `${uniqueId}_${file.name}`);

          // Copia de forma instantânea para a pasta segura
          arquivoTemporario.copy(arquivoPermanente);

          const permanentUri = arquivoPermanente.uri;

          //Insere no banco de dados
          await db.runAsync(
            'INSERT INTO trilhas (id, titulo, artista, capa, url) VALUES (?, ?, ?, ?, ?)',
            uniqueId,
            //Tira o .mp3 do nome para ficar limpo
            file.name.replace('.mp3', ''),
            'Artista Desconhecido',
            'https://i.pravatar.cc/150?u=' + uniqueId, //Gera uma capa aleatória
            permanentUri
          );
        }

        //Para saber se deu certo
        console.log('Músicas inseridas no banco de dados');
        console.log('Músicas selecionadas: ', audioFiles);

        //Avisa ao usuário quantas músicas foram encontradas
        Alert.alert('Sucesso!', `${audioFiles.length} músicas importadas!`);
        carregarMusicas();
      }
      //Se não, erro! O app mostra um alerta
      else {
        Alert.alert("Aviso", "Nenhuma música selecionada");
      }
    }

    //Se alguma coisa der errado ao selecionar as músicas, informa no console
    catch (e) {
      console.error('Houve um erro ao selecionar as músicas: ', e);
    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Sua Biblioteca</Text>

      {/* Botão que vai acionar a função de selecionar os arquivos */}
      <TouchableOpacity style={styles.button} onPress={pickFolder}>
        <Text style={styles.buttonText}>+ Adicionar músicas</Text>
      </TouchableOpacity>

      <FlatList
        data={musicas} // Agora as músicas aparecem aqui

        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => playTrack(item)}>

              <Image source={{ uri: item.capa }} style={styles.art} />

              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.titulo}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artista}</Text>
              </View>

            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => removerMusica(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },

  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },

  itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' },

  item: { flexDirection: 'row', alignItems: 'center', flex: 1 },

  art: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },

  textContainer: { flex: 1, paddingRight: 10 },

  title: { color: '#fff', fontSize: 16, fontWeight: '600' },

  artist: { color: '#aaa', fontSize: 13 },

  deleteButton: { padding: 10 },

  button: {
    backgroundColor: '#9333ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});