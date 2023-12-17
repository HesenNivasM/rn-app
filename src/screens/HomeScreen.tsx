import { Ref, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View, FlatList, Text } from 'react-native';
import { Foundation as FoundationIcon } from '@expo/vector-icons';

import Movie from '../types/Movie';
import MovieSection from '../components/MovieSection';
import Genre from '../types/Genre';
import GenreSelection from '../components/GenreSelection';

function HomeScreen() {
	const [moviesList, setMoviesList] = useState<Array<Movie | number>>([]);

	const [genres, setGenres] = useState<Genre[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<number[]>();

	const [currentYearBottom, setCurrentYearBottom] = useState(2011);
	const [currentYearTop, setCurrentYearTop] = useState(2012);

	const controller = new AbortController();

	useEffect(() => {
		fetchGenres();
	}, []);

	const updateSelectedGenres = (id: number) => {
		if (id == 0) {
			setSelectedGenres([0]);
			refreshMoviesList([0], moviesList);
		} else {
			let updatedGenres = selectedGenres.filter((item) => item != 0);
			if (updatedGenres.includes(id)) {
				updatedGenres = updatedGenres.filter((item) => item != id);
			} else {
				updatedGenres = [...updatedGenres, id];
			}
			refreshMoviesList(updatedGenres, moviesList);
			setSelectedGenres(updatedGenres);
		}
	};

	const refreshMoviesList = (genres: number[], movies: (Movie | number)[]) => {
		genres = genres.filter((id) => id != 0);
		const updatedList = movies.map((item) => {
			if (typeof item == 'number') return item;
			else {
				const res = genres.reduce((prev, curr) => prev && item.genre_ids.includes(curr), true);

				if (res) item['isVisible'] = true;
				else if (genres.length == 1 && genres[0] == 0) item['isVisible'] = true;
				else {
					item['isVisible'] = false;
				}

				return item;
			}
		});

		setMoviesList(updatedList);
	};

	const fetchGenres = () => {
		fetch('https://api.themoviedb.org/3/genre/movie/list?' + new URLSearchParams({ api_key: process.env.API_KEY, language: 'en' }), {
			method: 'GET',
			signal: controller.signal,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.genres && data.genres.length > 0) {
					setGenres([{ id: 0, name: 'All' }, ...data.genres]);
					setSelectedGenres([0]);
				}
			})
			.catch();
	};

	const searchMovies = (position: string = 'none', ref: any = undefined) => {
		if (currentYearBottom == 2023 && position == 'bottom') return;
		let cYear = 2012;
		switch (position) {
			case 'top':
				cYear = currentYearTop;
				cYear -= 1;
				setCurrentYearTop(cYear);
				break;
			case 'bottom':
				cYear = currentYearBottom;
				cYear += 1;
				setCurrentYearBottom(cYear);
				break;
		}

		fetch(
			'https://api.themoviedb.org/3/discover/movie?' +
				new URLSearchParams({ api_key: process.env.API_KEY, sort_by: 'popularity.desc', primary_release_year: String(cYear), page: '1', 'vote_count.gte': '100' }),
			{ method: 'GET', signal: controller.signal }
		)
			.then((response) => response.json())
			.then((data) => {
				let results = data.results.map((item: any) => ({ ...item, isVisible: true }));
				if (position == 'top') {
					let newList = [...[cYear, 9999, ...results], ...moviesList];
					if (genres && genres.length > 0 && selectedGenres && selectedGenres.length > 0) refreshMoviesList(selectedGenres, newList);
					else setMoviesList(newList);
					if (cYear != 2011) ref.current.scrollToIndex({ index: 22, animated: false });
					else setTimeout(() => ref.current.scrollToIndex({ index: 22, animated: false }), 100);
				} else {
					if (genres && genres.length > 0 && selectedGenres && selectedGenres.length > 0)
						refreshMoviesList(selectedGenres, [...moviesList, ...[cYear, 9999, ...results]]);
					else setMoviesList([...moviesList, ...[cYear, 9999, ...results]]);
				}
			})
			.catch();
	};

	return (
		<View style={styles.container}>
			<View style={styles.mainContent}>
				<View style={styles.image}>
					<Text style={{ color: 'red', fontWeight: '900', fontSize: 32 }}>MOVIEFIX</Text>
				</View>
				<View>
					<GenreSelection genres={genres} selectedGenres={selectedGenres} updateSelectedGenres={updateSelectedGenres} />
				</View>

				<View style={{ marginBottom: 220 }}>
					<MovieSection
						movies={moviesList.filter((item) => {
							if (typeof item == 'number') return item;
							else if (item.isVisible) return item;
						})}
						sectionTitle="Now playing in theaters..."
						loadMore={(position: string, flatListRef: any) => searchMovies(position, flatListRef)}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
	},
	scrollView: {
		bottom: '20%',
		marginTop: 170,
	},
	mainContent: {
		width: '100%',
		top: 50,
	},
	image: {
		alignItems: 'center',
		marginBottom: 20,
	},
});

export default HomeScreen;
