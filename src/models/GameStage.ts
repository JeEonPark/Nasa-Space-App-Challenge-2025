// Game stage
export type GameStage =
    | 'welcome'             // Start screen (first time only)
    | 'waitingToStart'      // Waiting to start
    | 'zoomingToPhoto'      // Zooming to photo
    | 'viewingPhoto'        // Viewing photo
    | 'answeringOnMap'      // Answering on map
    | 'showingResults';     // Showing results