import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import { Movie as MovieView } from "../../View";

class Movie extends Component {
  state = {
    movie: null,
    directors: [],
    loading: false,
  };

  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
      const state = JSON.parse(
        localStorage.getItem(`${this.props.match.params.movieId}`)
      );
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      //first fetch the movie data and then actors
      const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchMovieData(endpoint);
    }
  }

  fetchMovieData = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState(
            {
              movie: result,
            },
            () => {
              const endpoint_credit = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}&language=en-US`;
              fetch(endpoint_credit)
                .then((result) => result.json())
                .then((result) => {
                  const directors = result.crew.filter(
                    (member) => member.job === "Director"
                  );
                  this.setState(
                    {
                      directors,
                      loading: false,
                    },
                    () => {
                      localStorage.setItem(
                        `${this.props.match.params.movieId}`,
                        JSON.stringify(this.state)
                      );
                    }
                  );
                });
            }
          );
        }
      })
      .catch((error) => console.error("Error: ", error));
  };

  render() {
    const { movie, directors, loading } = this.state;
    return <MovieView movie={movie} directors={directors} loading={loading} />;
  }
}

export default Movie;
