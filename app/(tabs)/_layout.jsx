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
                name = "home"
                options = {{
                    title: "Home",
                    headerShown:false,
                    // tabBarIcon: ({ color, focused }) => (
                    //     <TabIcon
                    //         icon={}
                    //     />
                    // )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout