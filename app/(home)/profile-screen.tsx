import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { useTheme } from "@/components/theme/theme-context";
import { UserRoundPen, CircleUserRound, Pencil} from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';


const ProfileScreen: React.FC = () => {
    const { theme, setTheme, currentColors } = useTheme();
    const { background, foreground, primary, tertiary, muted } = currentColors;
    const [image, setImage] = useState<string | null>(null); // Correct destructuring
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    return (
        <GestureHandlerRootView>
            <SafeAreaWrapper className="bg-background px-4 pb-8">
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View className="flex-1 gap-1 mt-20">
                        <View style={styles.iconContainer}>
                            {image ? (
                                    <Image source={{ uri: image }} style={styles.image} />
                                ) : (
                                    <CircleUserRound
                                        size={200}
                                        color={foreground}
                                        strokeWidth={1}
                                    />
                                )}
                                <TouchableOpacity onPress={pickImage}>
                                <Pencil
                                    size={35}
                                    color={foreground}
                                    strokeWidth={2}
                                    style = {styles.iconOverlap}
                                />
                                </TouchableOpacity>
                        </View>
                        <Text className="text-center text-4xl text-[#ffffff] font-bold">Hello, user!</Text>
                        <Text className="text-center text-base text-[#827D95]">Joined November 2024</Text>
                        <View style={styles.bio}>
                            <Text style={styles.bioText}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras mattis magna in leo facilisis fermentum. Cras lorem dolor,
                             egestas in metus et, porttitor vehicula libero. Sed tincidunt 
                             tortor posuere, consequat velit hendrerit, iaculis erat. Duis at mattis nisl.
                        </Text>     
                        </View>
                        <View style={styles.streak} />
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis magna in leo 
                            facilisis fermentum. Cras lorem dolor, egestas in metus et, porttitor vehicula libero. 
                            Sed tincidunt tortor posuere, consequat velit hendrerit, iaculis erat. Duis at mattis nisl. 
                            Quisque odio nunc, egestas eu pellentesque vulputate, sollicitudin gravida ante. Aliquam nec 
                            placerat velit. Sed blandit posuere ante vel ornare. Sed sodales vulputate enim, vel placerat 
                            ante pellentesque eget. Suspendisse ex urna, sagittis eget fringilla eget, dapibus ut ligula. 
                            Aliquam a felis tincidunt, porttitor nisl sed, imperdiet neque. Pellentesque viverra velit sit 
                            amet mauris molestie fermentum. In hac habitasse platea dictumst. Class aptent taciti sociosqu 
                            ad litora torquent per conubia nostra, per inceptos himenaeos.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaWrapper>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
    },
    iconOverlap: {
        position: 'absolute',
        top: -35,
        right: -85
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    bio: {
        width: 390,
        height: 156,
        backgroundColor: '#BFBED8', 
        marginTop: 20,
        borderRadius: 35,
        padding: 15, 

    },
    bioText: {
        position: 'absolute',
        top: 15,
        left: 20,
        color: '#000000',
        fontSize: 16,
        maxWidth: '100%',
    },
    streak: { //PLACEHOLDER FOR STREAK FEATURE
        width: 390,
        height: 100,
        backgroundColor: '#594EFC', 
        marginTop: 20,
        borderRadius: 20
    },
    placeholder: {
        width: 390,
        height: 400,
        backgroundColor: '#BFBED8', 
        marginTop: 20,
        borderRadius: 35,
        padding: 15, 
    },
    placeholderText: {
        position: 'absolute',
        top: 15,
        left: 20,
        color: '#000000',
        fontSize: 16,
        maxWidth: '100%',
    },
});

export default ProfileScreen;