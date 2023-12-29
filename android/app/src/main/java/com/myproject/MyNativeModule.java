package com.myproject;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.ArrayList;
import java.util.List;

import com.facebook.react.bridge.Promise; 

import java.net.InetAddress;
import java.net.Socket;
import java.net.InetSocketAddress;
import java.io.IOException;

import java.net.Inet4Address;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MyNativeModule extends ReactContextBaseJavaModule {
  public MyNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "MyNativeModule";
  }
   public boolean isPortOpen(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 1000);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    @ReactMethod
    public void scanNetwork(Promise promise) {
    WritableArray resultArray = Arguments.createArray();

    new Thread(() -> {
        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
            final int[] k = {0};
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();
                Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();

                while (inetAddresses.hasMoreElements()) {
                    InetAddress inetAddress = inetAddresses.nextElement();

                    // Exclude loopback address
                    if (!inetAddress.isLoopbackAddress() ) {
                        String ip = inetAddress.getHostAddress();
                        String sip = ip.substring(0, ip.lastIndexOf('.') + 1);

                        List<Thread> threads = new ArrayList<>();

                        for (int it = 1; it <= 254; it++) {
                            String ipToTest = sip + it;

                            Thread thread = new Thread(() -> {
                                try {
                                    boolean online = InetAddress.getByName(ipToTest).isReachable(3000); // 1 second timeout
                                    if (online) {
                                        if(isPortOpen(ipToTest,9100)){
                                            WritableMap addressMap = Arguments.createMap();
                                            String hostname = InetAddress.getByName(ipToTest).getHostName();
                                            if(hostname.equals(ipToTest)){
                                                k[0]++;
                                                addressMap.putString("hostname","Printer " + String.valueOf(k[0]));
                                            }
                                            addressMap.putString("ip", ipToTest);
                                            resultArray.pushMap(addressMap);
                                        }
                                    }
                                } catch (IOException e) {
                                    // Handle exception if needed
                                    // e.printStackTrace();
                                }
                            });

                            threads.add(thread);
                            thread.start();
                        }

                        // Wait for all threads to finish
                        for (Thread thread : threads) {
                            try {
                                thread.join();
                            } catch (InterruptedException e) {
                                // Handle exception if needed
                                // e.printStackTrace();
                            }
                        }
                    }
                }
            }

            promise.resolve(resultArray);
        } catch (SocketException e) {
            // Handle exception if needed
            promise.reject("SCAN_ERROR", "Error scanning network");
        }
    }).start();

    }
}

