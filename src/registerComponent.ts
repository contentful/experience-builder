import { sendMessage } from "./sendMessage";
import { RegisteredComponentParameters } from "./types";

export type RegisteredComponentData = {
  component: any,
} & RegisteredComponentParameters

let registeredComponents: RegisteredComponentData[] = [];

export class RegisterComponent {

	public register = (component: any, parameters: RegisteredComponentParameters) => {
		registeredComponents.push({ component, ... parameters });
		sendMessage('registeredComponents', parameters);
	}

	public getAll = ({ withComponents }: { withComponents: boolean }) => {
    if (withComponents) {
      return registeredComponents;
    }

    return registeredComponents.map((config) => {
      const { component, ...configWithoutComponent } = config;
      return configWithoutComponent;
    });
  };

	public getJson = () => {
    return JSON.stringify(registeredComponents);
  };

  public getRegistration = (id: string) => {
    return registeredComponents.find((registration) => registration.id === id);
  };

  public reset = () => {
    registeredComponents = [];
  };
}