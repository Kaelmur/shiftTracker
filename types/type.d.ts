import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface Shift {
  worker_id: string;
  start_time: string;
  user_name: string;
  user_email: string;
  duration: number;
  status: string;
  worker: {
    first_name: string;
  };
}

declare interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  setUserLocation: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void;
}

declare interface DecodedToken {
  userId: string;
  email?: string;
  name?: string;
  exp: number;
}

declare interface AuthContextType {
  token: string | null;
  userId: string | null;
  name: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  login: (token: string) => Promise<void>;
}
