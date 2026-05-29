import React from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

/**
 * Função de inicialização e migração do Banco de Dados.
 * A pessoa encarregada de criar as tabelas e a estrutura do banco
 * deve trabalhar principalmente dentro desta função ou chamar os scripts dela.
 */
async function initializeDatabase(db) {
  try {
    // WAL (Write-Ahead Logging) melhora significativamente a performance de leitura/escrita no SQLite
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Criamos uma tabela básica de metadados apenas para fins de teste e verificação de integridade
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    //Tabela para guardar as músicas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trilhas (
      id VARCHAR(255) PRIMARY KEY,
      titulo VARCHAR(255) NULL,
      artista VARCHAR(255) NULL,
      capa VARCHAR(255) NULL,
      url VARCHAR(255) NOT NULL
      );
      `);

    // Inserimos um registro de teste se ele já não existir
    await db.runAsync(
      'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?);',
      'db_initialized_at',
      new Date().toISOString()
    );

    console.log('[SQLite] Banco de dados inicializado com sucesso.');
  } catch (error) {
    console.error('[SQLite] Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}

/**
 * DatabaseProvider que envolve a aplicação.
 * Ele gerencia o ciclo de vida da conexão do SQLite de forma assíncrona.
 * Enquanto o banco estiver inicializando, ele pode exibir uma tela de carregamento (opcional).
 */
export const DatabaseProvider = ({ children }) => {
  return (
    <SQLiteProvider
      databaseName="nassaumusic.db"
      onInit={initializeDatabase}
    >
      {children}
    </SQLiteProvider>
  );
};

/**
 * Hook customizado para acessar a instância ativa do banco de dados SQLite.
 * Qualquer componente ou tela que precise fazer queries pode chamar useDatabase().
 */
export const useDatabase = () => {
  return useSQLiteContext();
};

    await db.execAsync(`
      CREATE TABLE IF NO EXISTS usuario(
      id VARCHAR(255) PRIMARY KEY,
      Nome VARCHAR(80) NOT NULL,
      Email VARCHAR(255) UNIQUE NOT NULL,
      Senha VARCHAR(255) NOT NULL,
      FotoDePerfil VARCHAR(255) NOT NULL
      );
        `);