/**
 * Configuración para la conexión a OpenAI
 */
require('dotenv').config();

module.exports = {
  apiKey: "sk-e182c130efd943ab8a23f0e19934e0a9",
  model: "deepseek-chat",
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  temperature: 0.3,
  maxTokens: 4000
};