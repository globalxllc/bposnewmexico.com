v24 changes (Edge/Chrome):
- V1 remains immersive but slightly inset: hero height = 94vh with 8px padding to avoid oversize/scrollbars.
- Cloudinary transformations added to all videos (f_auto, vc_auto, q_auto:eco, br_1m, w_1920) to reduce bitrate and buffering. Falls back to original sources if needed.
- Preload switched to 'metadata' to cut initial network load; autoplay still engaged.
- Sequence unchanged: V1 → V2 → Map (6s) → V3; only one plays at a time.
- Intake sticky and compact as in v23.
- Email routing unchanged (backoffice + copy to globalxllc@gmail.com).