import { StyleSheet, Text, View, FlatList } from 'react-native';
import Movie from '../types/Movie';
import MovieCard from './MovieCard';
import { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';

function MovieSection({ movies, sectionTitle, loadMore }: { movies: Array<Movie | number>; sectionTitle: string; loadMore: any }) {
	const flatListRef = useRef<FlashList<Movie>>();
	return (
		<View style={styles.section}>
			<FlashList
				data={movies}
				renderItem={({ item }) => {
					if (typeof item == 'number') {
						if (item == 9999) return <View></View>;
						else
							return (
								<View>
									<Text style={{ color: 'white', fontSize: 32, fontWeight: '700', marginVertical: 20 }}>{item}</Text>
								</View>
							);
					} else
						return (
							<View style={styles.cardWraper}>
								<MovieCard key={item.id} movie={item} height={250} width={165} />
							</View>
						);
				}}
				estimatedItemSize={200}
				numColumns={2}
				refreshing={false}
				onRefresh={() => {
					loadMore('top', flatListRef);
				}}
				ref={flatListRef}
				onEndReached={() => {
					loadMore('bottom', flatListRef);
				}}
				onEndReachedThreshold={1}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		height: '100%',
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: '500',
		color: '#FFF',
	},
	cardWraper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default MovieSection;
