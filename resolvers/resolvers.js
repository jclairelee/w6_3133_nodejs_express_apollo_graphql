import Movie from "../models/Movie.js";

const movieResolvers = {
  Query: {
    getAllMovies: async () => {
      return await Movie.find();
    },

    getMovieById: async (_, { id }) => {
      return await Movie.findById(id);
    },

    // Using static method here
    getMoviesByDirector: async (_, { director_name }) => {
      return await Movie.findByDirector(director_name);
    },
  },

  Mutation: {
    addMovie: async (_, args) => {
      const movie = new Movie(args);
      return await movie.save();
    },

    updateMovie: async (_, { id, ...updates }) => {
      return await Movie.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
    },

    deleteMovie: async (_, { id }) => {
      await Movie.findByIdAndDelete(id);
      return "Movie deleted successfully";
    },
  },

  // Resolver for virtual + method fields
  Movie: {
    movie_age: (parent) => parent.movie_age,
    movieSummary: (parent) => parent.getMovieSummary(),
  },
};

export default movieResolvers;
