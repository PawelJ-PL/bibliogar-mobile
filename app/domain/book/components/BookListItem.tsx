import React from "react";
import {IconProps, Image, ListItem} from "react-native-elements";
import {Book} from "../types/Book";
import {StyleProp, StyleSheet, TextStyle} from "react-native";
import questionMark from '../../../../resources/question-mark.png'

type Props = {
    book: Book | null
    rightIcon?: Partial<IconProps> | React.ReactElement<{}>;
    onPress?: () => void
}

const BookListItem: React.FC<Props> = ({book, rightIcon, onPress}) => {
    const cover = book?.cover ? <Image source={{uri: book.cover}} style={styles.cover}/> : <Image source={questionMark} style={styles.cover} />;
    const titleStyle: StyleProp<TextStyle> = !book ? {opacity: 0.3, fontStyle: 'italic'} : {};

    return (
        <ListItem
            title={book?.title || 'Pominięty'}
            titleStyle={titleStyle}
            subtitle={book?.authors || undefined}
            bottomDivider={true}
            leftElement={cover}
            rightIcon={rightIcon}
            onPress={onPress}
        />
    )
};

const styles = StyleSheet.create({
    cover: {
        width: 60,
        height: 90
    }
});

export default BookListItem
