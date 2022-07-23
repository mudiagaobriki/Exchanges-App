import React, {
	forwardRef,
	ReactEventHandler,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from "react";
import {WalletService} from "../services";
import {Dimensions, ImageBackground, StyleSheet, View} from "react-native";
import {Text} from "./Text";
import Carousel from "react-native-snap-carousel";
import {mf} from "../helpers";
import {AuthenticationContext} from "../context";

const _NjWalletCarousel = (props: { currencies?: [string], parentCallback?: (e:Number) => void }, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
	const inputRef = useRef()
	const authContext = useContext(AuthenticationContext);
	const user = authContext.user;
	useImperativeHandle(ref, () => ({
		refresh: () => {fetchWalletBalances()},
		current: inputRef.current,
	}))
	const currencies = props.currencies || [];
	const initialSlidesState = [{
		title: 'Loading...',
		sub_title: ''
	}];
	const [walletBalancesSlides, setWalletBalancesSlides] = useState<Array<{ title: string; sub_title: string; }>>(initialSlidesState);
	const [paginationIndex, setPaginationIndex] = useState(0);

	const fetchWalletBalances = () => {
		console.log("User from Wallet Carousel: ", user)
		setWalletBalancesSlides(initialSlidesState);
		WalletService.getBalances()
			.then((balances) => {
				let userCurrency = user?.currency_code
				let homeCurrencyBalance = balances[userCurrency]
				console.log("Balances from wallet carousel: ",balances);
				console.log("User Currency: ",userCurrency);
				console.log("Home Currency Balance: ",homeCurrencyBalance);
				delete balances[userCurrency]
				balances = {[userCurrency]: homeCurrencyBalance, ...balances}
				console.log("Rearranged Balances from wallet carousel: ",balances[Object.keys(balances)[0]]);

				let slides: { title: string; sub_title: string; }[] = []
				Object.keys(balances).forEach(currency => {
					const balance = mf(balances[currency], currency, {decimal: 2, currency_before: true})
					if(currencies.length > 0){
						// @ts-ignore
						if(currencies.includes(currency)) {
							slides.push({title: `${currency} Wallet`, sub_title: `${balance}`})
						}
					}else{
						slides.push({title: `${currency} Wallet`, sub_title: `${balance}`})
					}
				})
				setWalletBalancesSlides(slides);
			})
			.catch((err) => alert(err.message));
	};

	useEffect(() => fetchWalletBalances(), []);


	const _renderItem = ({ item } : { item: { title: string; sub_title: string; } }) => {
		return (
			<View style={{ flexDirection: "row" }}>
				<View style={styles.viewBox}>
					<ImageBackground style={styles.acInfoImage} source={require("../../assets/images/account-screen/ac-bg.png")}>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
							<View style={{ flex: 1, justifyContent: "center" }}>
								<Text
									style={{
										fontFamily: "Rubik-Regular",
										fontSize: 20,
										fontWeight: "bold",
										color: "white",
										textAlign: "center",
									}}
								>
									{item.title}
								</Text>
								<Text
									style={{
										marginTop: 5,
										fontFamily: "Rubik-Regular",
										fontSize: 26,
										fontWeight: "bold",
										color: "white",
										textAlign: "center",
									}}
								>
									{item.sub_title}
								</Text>
							</View>
						</View>
					</ImageBackground>
				</View>
			</View>
		);
	};

	return (
		<>
			<Carousel
				data={walletBalancesSlides}
				layout={"stack"}
				renderItem={_renderItem}
				sliderWidth={win.width - 60}
				itemWidth={win.width - 80}
				layoutCardOffset={10}
				onSnapToItem={(slideIndex) => {
					props.parentCallback(slideIndex)
					setPaginationIndex(slideIndex)}}
				// autoplay
				// loop={true}
				// activeSlideOffset={10}
				// activeSlideAlignment={'center'}
				lockScrollWhileSnapping
				autoplayInterval={3000}
				ref={inputRef}
				// onScroll={() => console.log(inputRef.current)}
			/>
			{/*<Pagination
        activeDotIndex={paginationIndex}
        dotsLength={walletBalancesSlides.length}
        inactiveDotScale={0.5}
        inactiveDotOpacity={0.5}
        containerStyle={styles.paginationContainerStyle}
        dotStyle={styles.paginationDotStyle} />*/}
		</>
	)
}

export const NjWalletCarousel = forwardRef(_NjWalletCarousel);

const win = Dimensions.get("window");
const styles = StyleSheet.create({
	acInfoImage: {
		resizeMode: "contain",
		width: "100%",
		height: (win.height - 200) / 4,
		borderRadius: 20,
		overflow: "hidden",
		marginTop: 20,
		marginBottom: 20,
	},
	viewBox: {
		justifyContent: "center",
		width: "100%",
		alignItems: "center"
	},
	paginationContainerStyle: {
		paddingVertical: 0,
		marginTop: 6,
	},
	paginationDotStyle: {
		marginHorizontal: -20,
	},
})
