import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import styles from './styles';

import { Audio } from 'expo-av';
import { Sound } from "expo-av/build/Audio";
const song = {
    id: '1',
    uri: 'https://dark-signal.s3.amazonaws.com/Dark+Signal+-+Impatient+%5BHD%5D.mp3',
    imageUri: 'https://scontent.fdad3-3.fna.fbcdn.net/v/t1.6435-9/45566986_2340610802620348_1710873499075084288_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=9267fe&_nc_ohc=DJAfGWIE-asAX_2p8s4&_nc_ht=scontent.fdad3-3.fna&oh=3512c798a83894fb489c88b9a7c8f89c&oe=60E53E9E',
    title: 'Impatents',
    artist: 'Dark Signal',
}

const PlayerWidget = () => {

    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [duration, setDuration] = useState<number | null>(null);
    const [position, setPosition] = useState<number | null>(null);

    const onPlaybackStatusUpdate = (status) => {
        setIsPlaying(status.isPlaying);
        setDuration(status.durationMillis);
        setPosition(status.positionMillis);
    }

    const playCurrentSong = async () => {
        if (sound) {
            await sound.unloadAsync();
        }

        const { sound: newSound } = await Sound.createAsync(
            { uri: song.uri },
            { shouldPlay: isPlaying },
            onPlaybackStatusUpdate
        )
        setSound(newSound)
    }

    useEffect(() => {
        playCurrentSong();
    }, [])

    const onPlayPausePress = async () => {
        if (!sound) {
            return;
        }
        if (isPlaying) {
            await sound.stopAsync();
        } else {
            await sound.playAsync();
        }
    }

    const getProgress = () => {
        if (sound === null || duration === null || position === null) {
            return 0;
        }
        return (position / duration) * 100;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.progress, { width: `${getProgress()}%` }]} />
            <View style={styles.row}>
                <Image source={{ uri: song.imageUri }} style={styles.image} />
                <View style={styles.rightContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.title}>{song.title}</Text>
                        <Text style={styles.artist}>{song.artist}</Text>
                    </View>

                    <View style={styles.iconsContainer}>
                        <AntDesign name="hearto" size={30} color={"white"} />
                        <TouchableOpacity onPress={onPlayPausePress}>
                            <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )

}

export default PlayerWidget;