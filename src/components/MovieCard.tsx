import { useState } from 'react';
import { View, Modal, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Movie from '../types/Movie';
import MovieInfoModal from './MovieInfoModal';
import { AntDesign as AntDesignIcon } from '@expo/vector-icons';

function MovieCard({ movie, height, width }: { movie: Movie; height: number; width: number }) {
	const imageSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
	const [visible, setVisible] = useState(false);

	const openModal = () => setVisible(true);
	const closeModal = () => setVisible(false);

	return (
		<>
			<Modal visible={visible} transparent={true} onRequestClose={closeModal} animationType="slide">
				<TouchableOpacity onPress={closeModal} style={{ height: '100%' }} />
				<MovieInfoModal movie={movie} />
			</Modal>

			<TouchableOpacity onPress={openModal}>
				<View style={styles.movieCard}>
					{movie.poster_path ? (
						<View>
							<Image style={{ height, width, ...styles.image }} source={{ uri: imageSrc }} />
							<View style={{ position: 'absolute', bottom: 0, padding: 5, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' }}>
								<Text style={{ color: 'white', fontSize: 14 }}>{movie.title}</Text>
								<Text style={{ color: 'white', fontSize: 10 }}>{movie.vote_average + '/10'}</Text>
							</View>
						</View>
					) : (
						<View style={{ height, width, ...styles.viewAlt }}>
							<Text style={styles.textAlt}>{movie.title}</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		</>
	);
}

const styles = StyleSheet.create({
	movieCard: {
		marginVertical: 14,
	},
	title: {
		color: 'white',
	},
	image: {
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#252525',
	},
	textAlt: {
		color: '#FFF',
		textAlign: 'center',
		fontSize: 25,
		fontWeight: '400',
	},
	viewAlt: {
		padding: 2,
		borderColor: '#FFF',
		borderWidth: 4,
		borderRadius: 10,
		display: 'flex',
		justifyContent: 'center',
	},
});

export default MovieCard;
