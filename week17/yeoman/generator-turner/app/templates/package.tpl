{
  "name": "<%= appname %>",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    <% if (dependencies.babel) { %>
      "@vue/cli-plugin-babel": "^4.4.0",
    <% } %>
    <% if (dependencies.eslint) { %>
      "@vue/cli-plugin-eslint": "^4.4.0",
      "babel-eslint": "^10.1.0",
      "eslint": "^6.7.2",
      "eslint-plugin-vue": "^6.2.2",
    <% } %>
    <% if (dependencies.typescript) { %>
      "@vue/cli-plugin-typescript": "^4.4.0",
      "@vue/eslint-config-typescript": "^5.0.2",
    <% } %>
    "vue-template-compiler": "^2.6.11"
  }
}