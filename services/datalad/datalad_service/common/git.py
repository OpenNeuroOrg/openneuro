import subprocess


def git_show(path, commitish):
    return subprocess.run(['git', 'cat-file', 'blob', commitish],
                          cwd=path, capture_output=True, encoding='utf-8', bufsize=0, universal_newlines=True, check=True).stdout


def delete_tag(path, tag):
    return subprocess.run(['git', 'tag', '-d', tag],
                          cwd=path, stdout=subprocess.PIPE, encoding='utf-8', bufsize=0, universal_newlines=True, check=True)
