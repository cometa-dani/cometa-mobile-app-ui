// import { VStack } from '@/components/utils/stacks';
// import { FontAwesome6 } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { FC, ReactNode, useState } from 'react';
// import { FlatList, Pressable, Text, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { createStyleSheet, useStyles } from 'react-native-unistyles';
// import { Condition } from '@/components/utils/ifElse';


// type ImagePickerAsset = ImagePicker.ImagePickerAsset


// export type IPhotoPlaceholder = {
//   position: number;
//   asset?: ImagePickerAsset
// }

// export const createEmptyPlaceholders = (x: number): IPhotoPlaceholder[] => (
//   Array
//     .from({ length: x })
//     .map(
//       (_, i) => ({
//         position: i,
//         asset: undefined
//       })
//     )
// );

// export const hasAsset = (photo: IPhotoPlaceholder) => photo?.asset;

// const appendPhoto = (pickedPhotos: ImagePickerAsset[]) => {
//   const appendPhoto = (prev: IPhotoPlaceholder[]) => {
//     let counter = 0;
//     const currentAssets = prev.filter(hasAsset);
//     return (
//       prev.map((photo, index, arr) => {
//         const shouldReplace = (index + 1) > (currentAssets.length);
//         if (shouldReplace) {
//           const newPhoto = {
//             ...photo,
//             asset: pickedPhotos?.at(counter)
//           };
//           counter++;
//           return newPhoto;
//         }
//         return photo;
//       })
//     );
//   };
//   return appendPhoto;
// };

// const replacePhoto = (pickedPhotos: ImagePickerAsset[], selectedPosition: number) => {
//   const replacePhoto = (prev: IPhotoPlaceholder[]) => {
//     return prev.map(photo => {
//       const isSelected = photo.position === selectedPosition;
//       if (isSelected) {
//         return {
//           ...photo,
//           asset: pickedPhotos?.at(0)
//         };
//       }
//       return photo;
//     });
//   };
//   return replacePhoto;
// };


// interface IPhotosGridProps {
//   /**
//    *
//    * @description if acttion is 'update' returns 1 photo, if 'create' returns all photos
//    */
//   onSelect: (photos: IPhotoPlaceholder[]) => void
//   setInitialPhotos: () => IPhotoPlaceholder[],
//   action?: 'create' | 'update',
//   footer?: () => ReactNode
// }
// export const PhotosGrid: FC<IPhotosGridProps> = ({ setInitialPhotos, onSelect, action = 'create', footer }) => {
//   const { styles, theme } = useStyles(uploadYourPhotosSheet);
//   const [userPhotos = [], setUserPhotos] = useState<IPhotoPlaceholder[]>(setInitialPhotos);
//   const [firstPhoto, ...restPhotos] = userPhotos;

//   const handlePickMultipleImages = async (selectedPosition = 0, isPositionSelected = false) => {
//     const currentAssets = userPhotos.filter(hasAsset); // filter out the already exisisting images
//     const isGridFull = userPhotos.length === currentAssets.length;
//     try {
//       const takePhotos: number = userPhotos.length - currentAssets.length; // take a number below the limit
//       const pickedPhotos = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'],
//         allowsMultipleSelection: action === 'update' ? false : !isGridFull, // picks multiple images
//         allowsEditing: action === 'update' ? true : isPositionSelected,
//         selectionLimit: isGridFull ? 1 : takePhotos,
//         aspect: [4, 3],
//         quality: 1,
//       });
//       if (!pickedPhotos.canceled) {
//         const newPhotos = (
//           isPositionSelected ?
//             replacePhoto(pickedPhotos.assets, selectedPosition)(userPhotos)
//             : appendPhoto(pickedPhotos.assets)(userPhotos)
//         );
//         setUserPhotos(newPhotos); // update the grid's state
//         if (action === 'create') {
//           onSelect(newPhotos); // lift up all the new photos
//         }
//         if (action === 'update') {
//           onSelect([{         // lift up the single updated photo
//             position: selectedPosition,
//             asset: pickedPhotos.assets[0]
//           }]);
//         }
//       }
//     }
//     catch (error) {
//       return null;
//     }
//   };

//   return (
//     <VStack gap={theme.spacing.sp2}>
//       <Pressable
//         onPress={() => handlePickMultipleImages(0, !!firstPhoto.asset?.uri)}
//         style={({ pressed }) => styles.mainImageViewer(pressed, !firstPhoto?.asset)}
//       >
//         <Condition
//           if={firstPhoto?.asset}
//           then={
//             <Image
//               style={styles.mainImage}
//               source={{ uri: firstPhoto?.asset?.uri }}
//               contentFit='cover'
//             />
//           }
//           else={
//             <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
//           }
//         />
//         <View style={styles.imageNum}>
//           <Text style={styles.imageNumText}>{1}</Text>
//         </View>
//       </Pressable>

//       <FlatList
//         bounces={false}
//         data={restPhotos} // replace with your actual data
//         numColumns={3}
//         showsVerticalScrollIndicator={false}
//         columnWrapperStyle={{ gap: theme.spacing.sp2 }}
//         contentContainerStyle={{ gap: theme.spacing.sp2, minHeight: 200 }}
//         ListFooterComponent={footer && footer}
//         renderItem={({ item, index }) => {
//           return (
//             <Pressable
//               onPress={() => handlePickMultipleImages(item.position, !!item?.asset?.uri)}
//               style={({ pressed }) => styles.imageViewer(pressed, !item?.asset)}
//             >
//               <Condition
//                 if={item?.asset}
//                 then={
//                   <Image
//                     style={styles.image}
//                     source={{ uri: item?.asset?.uri }}
//                     contentFit='cover'
//                   />
//                 }
//                 else={
//                   <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
//                 }
//               />
//               <View style={styles.imageNum}>
//                 <Text style={styles.imageNumText}>{index + 2}</Text>
//               </View>
//             </Pressable>
//           );
//         }}
//         keyExtractor={(_, index) => index.toString()}
//       />
//     </VStack>
//   );
// };


// const uploadYourPhotosSheet = createStyleSheet((theme) => ({
//   mainImage: {
//     flex: 1,
//     aspectRatio: 2.4,
//     borderRadius: theme.radius.sm,
//   },
//   image: {
//     flex: 1,
//     aspectRatio: 1,
//     borderRadius: theme.radius.sm,
//   },
//   mainImageViewer: (isPressed: boolean, showBorder = true) => ({
//     position: 'relative',
//     aspectRatio: 2.4,
//     borderWidth: showBorder ? 2 : undefined,
//     backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
//     borderColor: theme.colors.gray100,
//     borderStyle: 'dashed',
//     borderRadius: theme.radius.sm,
//     alignItems: 'center',
//     justifyContent: 'center',
//   }),
//   imageViewer: (isPressed: boolean, showBorder = true) => ({
//     position: 'relative',
//     flex: 1,
//     aspectRatio: 1.05,
//     borderWidth: showBorder ? 2 : undefined,
//     backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
//     borderColor: theme.colors.gray100,
//     borderStyle: 'dashed',
//     borderRadius: theme.radius.sm,
//     alignItems: 'center',
//     justifyContent: 'center',
//   }),
//   imageNum: {
//     position: 'absolute',
//     zIndex: 10,
//     top: 7,
//     right: 7,
//     backgroundColor: theme.colors.white70,
//     shadowColor: theme.colors.gray900,
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 1,
//     borderRadius: 9999,
//     width: theme.spacing.sp7,
//     aspectRatio: 1,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   imageNumText: {
//     color: theme.colors.gray900,
//     fontFamily: theme.text.fontSemibold,
//     fontSize: theme.text.size.s2
//   }
// }));
