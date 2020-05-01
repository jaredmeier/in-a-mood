const HOST =
    process.env.NODE_ENV === "production"
        ? "inamood.herokuapp.com"
        : "localhost";

export default HOST;
