import cProfile
import io
import logging
import pstats
import time
import tracemalloc

logger = logging.getLogger('datalad_service.middleware.profiling')


class ProfilingMiddleware:
    def __init__(self):
        if not tracemalloc.is_tracing():
            tracemalloc.start()

    async def process_request(self, req, resp):
        req.context['start_time'] = time.time()
        req.context['tracemalloc_snapshot'] = tracemalloc.take_snapshot()
        profiler = cProfile.Profile(time.process_time)
        try:
            profiler.enable()
            req.context['cprofile'] = profiler
        except ValueError:
            pass

    async def process_response(self, req, resp, resource, req_succeeded):
        if 'cprofile' in req.context:
            req.context['cprofile'].disable()
        if 'start_time' in req.context:
            elapsed = time.time() - req.context['start_time']
            if elapsed > 0.3:
                logger.info(f'Request {req.method} {req.path} took {elapsed:.3f}s')
                if 'cprofile' in req.context:
                    s = io.StringIO()
                    ps = pstats.Stats(req.context['cprofile'], stream=s).sort_stats(
                        'tottime'
                    )
                    ps.print_stats(10)
                    logger.info(
                        f'Top 10 CPU consuming functions for {req.method} {req.path}:'
                    )
                    logger.info(s.getvalue())
        if 'tracemalloc_snapshot' in req.context:
            snapshot = tracemalloc.take_snapshot()
            top_stats = snapshot.compare_to(
                req.context['tracemalloc_snapshot'], 'lineno'
            )
            if sum(stat.size_diff for stat in top_stats) > 1024 * 1024:
                logger.info(f'Top 10 memory usage for {req.method} {req.path}:')
                for stat in top_stats[:10]:
                    logger.info(stat)
