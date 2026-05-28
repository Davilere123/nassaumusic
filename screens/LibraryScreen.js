import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { tracks } from '../mockData';
import { useAudio } from '../context/AudioContext';
import * as DocumentPicker from 'expo-document-picker'; //Importa a biblioteca que permite ao usuário selecionar as músicas
import { File, Paths } from 'expo-file-system'; // Nova API de arquivos do Expo 54
import { useDatabase } from '../context/DatabaseContext'; // Importa a biblioteca para acessar o banco de dados

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

          // Usa a nova API de arquivos do Expo 54
          const arquivoTemporario = new File(file.uri);
          const arquivoPermanente = new File(Paths.document, file.name);

          // Copia de forma instantânea para a pasta segura
          arquivoTemporario.copy(arquivoPermanente);

          const permanentUri = arquivoPermanente.uri;

          //Cria um id aleatório para a música
          const uniqueId = 'trilha_' + Date.now() + Math.floor(Math.random() * 1000);

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
          <TouchableOpacity style={styles.item} onPress={() => playTrack(item)}>

            <Image source={{ uri: item.capa }} style={styles.art} />

            <View>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.artist}>{item.artista}</Text>
            </View>

          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },

  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },

  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },

  art: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },

  title: { color: '#fff', fontSize: 16, fontWeight: '600' },

  artist: { color: '#aaa', fontSize: 13 },

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