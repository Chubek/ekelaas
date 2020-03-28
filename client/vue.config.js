module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/user": {
        target: "http://localhost:8000"
      },
      "/teacher": {
        target: "http://localhost:8000"
      },
      "/student": {
        target: "http://localhost:8000"
      },
      "/course": {
        target: "http://localhost:8000"
      },
      "/school": {
        target: "http://localhost:8000"
      }
    }
  }
};
