import React, { useState, Children, useContext, useEffect } from "react";

import { AuthenticationContext } from "./AuthenticationContext";
import { SystemService } from "../services";
import { Alert } from "react-native";

export type SystemConfigContextType = {
	config: {};
	refreshConfig: () => Promise<boolean>;
};

export const SystemConfigContext = React.createContext<SystemConfigContextType>({
	config: {},
	refreshConfig: () => Promise.resolve(true),
});

export const SystemConfigProvider: React.FC<object> = (props) => {
	const [config, setConfig] = useState<any>({});
	const authContext = useContext(AuthenticationContext);

	useEffect(() => {
		refreshConfig().then(r => {})
	}, [authContext.isLoggedIn]);

	const refreshConfig = async () => {
		if (authContext.isLoggedIn) {
			 SystemService.getConfig()
				.then((res) => {
					setConfig(res);
					return Promise.resolve(true);
				})
				.catch((err) => {
					if (err.response && err.response.status === 401) {
						authContext.logout().then(r => console.log(r));
					} else {
						Alert.alert(err.message);
					}
					return Promise.resolve(false);
				});
		}
		setConfig({});
		return Promise.resolve(false);
	};

	return (
		<SystemConfigContext.Provider value={{ config, refreshConfig }}>
			{Children.only(props.children)}
		</SystemConfigContext.Provider>
	);
};
