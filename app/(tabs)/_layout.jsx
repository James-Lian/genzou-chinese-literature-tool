import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router';


const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View>
            <Image
                source = {icon}
                resizeMode="contain"
            />
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs>
            <Tabs.Screen 
                name = "editor"
                options = {{
                    title: "Editor",
                    headerShown:false,
                    // tabBarIcon: ({ color, focused }) => (
                    //     <TabIcon
                    //         icon={}
                    //     />
                    // )
                }}
            />
            <Tabs.Screen 
                name = "dictionary"
                options = {{
                    title: "Dictionary",
                    headerShown:false,
                }}
            />
            <Tabs.Screen 
                name = "bookmarks"
                options = {{
                    title: "Bookmarks",
                    headerShown:false,
                }}
            />
            <Tabs.Screen 
                name = "saved-terms"
                options = {{
                    title: "Saved Terms",
                    headerShown:false,
                }}
            />
            <Tabs.Screen 
                name = "settings"
                options = {{
                    title: "Settings",
                    headerShown:false,
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout