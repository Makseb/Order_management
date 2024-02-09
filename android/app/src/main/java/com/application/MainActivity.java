/* android/app/src/main/java/MainActivity.java */

package com.application;
import android.os.Bundle; // Add this here
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // Add this here
public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Application";
  }

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }
}