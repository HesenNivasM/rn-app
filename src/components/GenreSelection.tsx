import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Genre from '../types/Genre';

function GenreSelection({ genres, selectedGenres, updateSelectedGenres }: { genres: Genre[]; selectedGenres: number[]; updateSelectedGenres: (id: number) => void }) {
	return (
		<View style={styles.section}>
			<FlatList
				data={genres}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={{
							padding: 10,
							backgroundColor: selectedGenres && selectedGenres.includes(item.id) ? 'red' : '#333',
							margin: 5,
							borderRadius: 5,
						}}
						onPress={() => updateSelectedGenres(item.id)}
					>
						<Text style={{ color: 'white' }}>{item.name}</Text>
					</TouchableOpacity>
				)}
				horizontal={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: '100%',
	},
});

export default GenreSelection;
