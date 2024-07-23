import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

import * as globals from '../../config/globals.js'

import { Colours } from '../../constants'
import { Icons } from "../../constants"

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center">
            <Image
                source = {icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-qbold' : 'font-qnormal'} text-xs`} style={{ color: color }}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarInactiveTintColor: "#808080", 
                    tabBarStyle: {
                        // backgroundColor:
                        borderTopWidth: 1,
                        borderTopColor: '#D3D3D3',
                        height: 88
                    }
                }}
            >                
                <Tabs.Screen 
                    name = "editor"
                    options = {{
                        title: "Editor",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.edit}
                                name="Editor"
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name = "dictionary"
                    options = {{
                        title: "Dictionary",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.bookOpen}
                                name="Dictionary"
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name = "bookmarks"
                    options = {{
                        title: "Bookmarks",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.bookmark}
                                name="Bookmarks"
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name = "saved-terms"
                    options = {{
                        title: "Saved Terms",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.star}
                                name="Saved Terms"
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name = "more"
                    options = {{
                        title: "More",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.more}
                                name="More"
                            />
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout